package com.rizoxzainu.hostingbot

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform

class RizoApp : Application() {

    companion object {
        const val CHANNEL_ID = "rizo_bot_foreground_channel"
        const val CHANNEL_NAME = "RIZO X ZAINU Bot 24/7 Engine"
    }

    override fun onCreate() {
        super.onCreate()
        
        // 1. Initialize Chaquopy Python Runtime
        if (!Python.isStarted()) {
            Python.start(AndroidPlatform(this))
        }

        // 2. Create Foreground Service Notification Channel (Persistent)
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Runs Telegram bots 24/7 locally utilizing phone RAM and Storage"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }
}
