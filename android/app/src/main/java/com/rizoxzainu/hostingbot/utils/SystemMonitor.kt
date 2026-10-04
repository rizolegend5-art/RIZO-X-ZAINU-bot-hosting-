package com.rizoxzainu.hostingbot.utils

import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.Environment
import android.os.PowerManager
import android.os.StatFs
import java.io.File
import java.io.RandomAccessFile

data class PhoneResourceMetrics(
    val totalRamMb: Long,
    val usedRamMb: Long,
    val freeRamMb: Long,
    val appRamMb: Long,
    val storageTotalGb: Double,
    val storageFreeGb: Double,
    val batteryPercent: Int,
    val isCharging: Boolean,
    val isBatteryOptimizationIgnored: Boolean
)

object SystemMonitor {

    fun getMetrics(context: Context): PhoneResourceMetrics {
        // 1. Memory Info (RAM)
        val actManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memInfo = ActivityManager.MemoryInfo()
        actManager.getMemoryInfo(memInfo)

        val totalRamMb = memInfo.totalMem / (1024 * 1024)
        val freeRamMb = memInfo.availMem / (1024 * 1024)
        val usedRamMb = totalRamMb - freeRamMb

        // App's own RAM consumption
        val pids = intArrayOf(android.os.Process.myPid())
        val processMemory = actManager.getProcessMemoryInfo(pids)
        val appRamMb = if (processMemory.isNotEmpty()) processMemory[0].totalPss / 1024L else 0L

        // 2. Storage Info
        val stat = StatFs(Environment.getDataDirectory().path)
        val blockSize = stat.blockSizeLong
        val totalBlocks = stat.blockCountLong
        val availableBlocks = stat.availableBlocksLong
        val storageTotalGb = (totalBlocks * blockSize) / (1024.0 * 1024.0 * 1024.0)
        val storageFreeGb = (availableBlocks * blockSize) / (1024.0 * 1024.0 * 1024.0)

        // 3. Battery Info
        val batteryIntent = context.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
        val level = batteryIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: 50
        val scale = batteryIntent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: 100
        val batteryPercent = (level * 100 / scale.toFloat()).toInt()
        val status = batteryIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL

        // 4. Battery Optimization Status (Critical for 24/7 background running)
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        val isIgnoringBatteryOptimizations = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            powerManager.isIgnoringBatteryOptimizations(context.packageName)
        } else {
            true
        }

        return PhoneResourceMetrics(
            totalRamMb = totalRamMb,
            usedRamMb = usedRamMb,
            freeRamMb = freeRamMb,
            appRamMb = appRamMb,
            storageTotalGb = Math.round(storageTotalGb * 10.0) / 10.0,
            storageFreeGb = Math.round(storageFreeGb * 10.0) / 10.0,
            batteryPercent = batteryPercent,
            isCharging = isCharging,
            isBatteryOptimizationIgnored = isIgnoringBatteryOptimizations
        )
    }

    /**
     * Auto RAM Cleanup: Checks if free RAM is below threshold (default 500MB)
     * and forces GC / purges Chaquopy Python cache to ensure bot process stability
     */
    fun checkAndTriggerLowRamCleanup(context: Context, thresholdMb: Long = 500L): Boolean {
        val actManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memInfo = ActivityManager.MemoryInfo()
        actManager.getMemoryInfo(memInfo)
        val freeRamMb = memInfo.availMem / (1024 * 1024)

        if (freeRamMb < thresholdMb) {
            // Force system and Python garbage collection
            System.gc()
            Runtime.getRuntime().gc()
            return true
        }
        return false
    }
}
