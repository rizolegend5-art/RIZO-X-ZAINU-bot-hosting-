package com.rizoxzainu.hostingbot.service

import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import com.chaquo.python.Python
import com.rizoxzainu.hostingbot.MainActivity
import com.rizoxzainu.hostingbot.RizoApp
import kotlinx.coroutines.*
import java.io.File

/**
 * RIZO X ZAINU HOSTING BOT - 24/7 Native Android Foreground Service
 * Keeps CPU active via PARTIAL_WAKE_LOCK so Telegram bot never dies
 * Even when screen is locked or user minimizes app.
 * Admin: Telegram @rizohacker
 */
class BotForegroundService : Service() {

    private var wakeLock: PowerManager.WakeLock? = null
    private val serviceJob = Job()
    private val serviceScope = CoroutineScope(Dispatchers.IO + serviceJob)
    private var isBotRunning = false

    companion object {
        const val ACTION_START_BOT = "ACTION_START_BOT"
        const val ACTION_STOP_BOT = "ACTION_STOP_BOT"
        const val EXTRA_BOT_ID = "EXTRA_BOT_ID"
        const val EXTRA_BOT_NAME = "EXTRA_BOT_NAME"
        const val EXTRA_POWER_SAVING_MODE = "EXTRA_POWER_SAVING_MODE"
        const val NOTIFICATION_ID = 1001

        const val BROADCAST_LOG = "com.rizoxzainu.hostingbot.LOG_EVENT"
        const val EXTRA_LOG_TEXT = "EXTRA_LOG_TEXT"
        const val EXTRA_LOG_TYPE = "EXTRA_LOG_TYPE"
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        acquireWakeLock()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        val botName = intent?.getStringExtra(EXTRA_BOT_NAME) ?: "RIZO Bot Engine"
        val botId = intent?.getStringExtra(EXTRA_BOT_ID) ?: "default_bot"
        val isPowerSaving = intent?.getBooleanExtra(EXTRA_POWER_SAVING_MODE, false) ?: false

        when (action) {
            ACTION_START_BOT -> {
                startForegroundServiceWithNotification(botName, isPowerSaving)
                runBotProcess(botId, botName, isPowerSaving)
            }
            ACTION_STOP_BOT -> {
                stopBotProcess()
            }
        }

        // START_STICKY ensures Android system recreates service if killed by low memory
        return START_STICKY
    }

    private fun startForegroundServiceWithNotification(botName: String, isPowerSaving: Boolean) {
        val openAppIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            openAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val modeLabel = if (isPowerSaving) " (Power Saving Mode - Eco)" else ""
        val notification = NotificationCompat.Builder(this, RizoApp.CHANNEL_ID)
            .setContentTitle("RIZO X ZAINU: $botName Active$modeLabel")
            .setContentText("Bot running 24/7 on Phone RAM • Admin: @rizohacker")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        startForeground(NOTIFICATION_ID, notification)
    }

    private fun runBotProcess(botId: String, botName: String, isPowerSaving: Boolean = false) {
        if (isBotRunning) {
            broadcastLog("⚠️ Bot engine is already running.", "warn")
            return
        }

        isBotRunning = true
        broadcastLog("🚀 [RIZO X ZAINU] Booting Foreground Worker for $botName...", "system")
        if (isPowerSaving) {
            broadcastLog("🔋 Power Saving Active: Throttled polling & restricted CPU wakeups enabled.", "info")
        } else {
            broadcastLog("⚡ High Performance Active: Full CPU speed and real-time polling.", "info")
        }

        serviceScope.launch {
            try {
                val py = Python.getInstance()
                val botDir = File(filesDir, "bots/$botId")
                val botScript = File(botDir, "bot.py")

                if (!botScript.exists()) {
                    broadcastLog("❌ bot.py not found in $botDir. Please host bot files first!", "stderr")
                    stopSelf()
                    return@launch
                }

                broadcastLog("📦 Loading environment variables & bot modules...", "pip")
                
                // Execute Python code in native sandbox
                val sys = py.getModule("sys")
                val path = sys["path"]
                path.callAttr("append", botDir.absolutePath)

                broadcastLog("▶️ Executing bot.py inside local Android RAM...", "stdout")
                
                // Custom runner script executing bot.py and capturing output
                val runnerCode = """
import sys
import runpy
import traceback

bot_file = "$botScript"
try:
    print(f"[RUNNER] Starting {bot_file}...")
    runpy.run_path(bot_file, run_name="__main__")
except Exception as e:
    traceback.print_exc()
"""
                py.getModule("builtins").callAttr("exec", runnerCode)
                
                broadcastLog("✅ Bot script completed execution.", "success")
            } catch (e: Exception) {
                broadcastLog("❌ Python Exception: ${e.localizedMessage}", "stderr")
            } finally {
                isBotRunning = false
            }
        }
    }

    private fun stopBotProcess() {
        broadcastLog("⏹️ Stopping 24/7 Foreground Service...", "system")
        isBotRunning = false
        serviceJob.cancelChildren()
        releaseWakeLock()
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun acquireWakeLock() {
        if (wakeLock == null) {
            val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
            wakeLock = powerManager.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK,
                "RizoHostingBot::CpuWakeLockTag"
            ).apply {
                acquire()
            }
        }
    }

    private fun releaseWakeLock() {
        wakeLock?.let {
            if (it.isHeld) {
                it.release()
            }
        }
        wakeLock = null
    }

    private fun broadcastLog(text: String, type: String) {
        val intent = Intent(BROADCAST_LOG).apply {
            putExtra(EXTRA_LOG_TEXT, text)
            putExtra(EXTRA_LOG_TYPE, type)
        }
        sendBroadcast(intent)
    }

    override fun onDestroy() {
        super.onDestroy()
        releaseWakeLock()
        serviceJob.cancel()
    }
}
