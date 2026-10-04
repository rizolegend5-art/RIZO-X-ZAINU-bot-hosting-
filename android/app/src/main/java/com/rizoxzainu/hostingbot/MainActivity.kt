package com.rizoxzainu.hostingbot

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.rizoxzainu.hostingbot.service.BotForegroundService
import com.rizoxzainu.hostingbot.ui.theme.RizoDarkTheme

class MainActivity : ComponentActivity() {

    private val logList = mutableStateListOf<String>()

    private val logReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val text = intent?.getStringExtra(BotForegroundService.EXTRA_LOG_TEXT)
            if (!text.isNullOrBlank()) {
                logList.add(text)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Register broadcast receiver for live terminal logs
        val filter = IntentFilter(BotForegroundService.BROADCAST_LOG)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(logReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(logReceiver, filter)
        }

        // Prompt ignore battery optimizations for uninterrupted 24/7 background running
        requestIgnoreBatteryOptimizations()

        setContent {
            RizoDarkTheme {
                MainAppScreen(
                    logs = logList,
                    onStartBot = { botId, botName ->
                        val serviceIntent = Intent(this, BotForegroundService::class.java).apply {
                            action = BotForegroundService.ACTION_START_BOT
                            putExtra(BotForegroundService.EXTRA_BOT_ID, botId)
                            putExtra(BotForegroundService.EXTRA_BOT_NAME, botName)
                        }
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            startForegroundService(serviceIntent)
                        } else {
                            startService(serviceIntent)
                        }
                    },
                    onStopBot = {
                        val serviceIntent = Intent(this, BotForegroundService::class.java).apply {
                            action = BotForegroundService.ACTION_STOP_BOT
                        }
                        startService(serviceIntent)
                    }
                )
            }
        }
    }

    private fun requestIgnoreBatteryOptimizations() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                data = Uri.parse("package:$packageName")
            }
            try {
                startActivity(intent)
            } catch (e: Exception) {
                // Ignore if device restricted
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(logReceiver)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScreen(
    logs: List<String>,
    onStartBot: (String, String) -> Unit,
    onStopBot: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("RIZO X ZAINU hosting bot", color = Color(0xFF00FF9D)) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFF0B1120))
            )
        },
        bottomBar = {
            NavigationBar(containerColor = Color(0xFF0F172A)) {
                // Button 1: Host New Bot
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.CloudUpload, contentDescription = "Host New Bot") },
                    label = { Text("Host New Bot") }
                )
                // Button 2: My Bots & Live Files
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.Folder, contentDescription = "My Bots") },
                    label = { Text("My Bots") }
                )
                // Button 3: Resource Monitor
                NavigationBarItem(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    icon = { Icon(Icons.Default.Speed, contentDescription = "Resource Monitor") },
                    label = { Text("Resource Monitor") }
                )
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(Color(0xFF050811))
        ) {
            when (selectedTab) {
                0 -> Text("Host New Bot Screen: Pick bot.py, requirements.txt, .env from Phone Storage", color = Color.White)
                1 -> Text("My Bots Screen: Start/Stop/Edit files and view active bots", color = Color.White)
                2 -> Text("Resource Monitor: Real-time RAM, CPU, WakeLock and Battery status", color = Color.White)
            }
        }
    }
}
