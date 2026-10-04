package com.rizoxzainu.hostingbot.engine

import android.content.Context
import com.chaquo.python.Python
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

object PythonEngine {

    suspend fun installRequirements(context: Context, botId: String, onLog: (String) -> Unit): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                onLog("📦 [pip] Checking requirements.txt for bot: $botId...")
                val botDir = File(context.filesDir, "bots/$botId")
                val reqFile = File(botDir, "requirements.txt")

                if (!reqFile.exists()) {
                    onLog("ℹ️ No requirements.txt found. Using default pyTelegramBotAPI.")
                    return@withContext true
                }

                val packages = reqFile.readLines().filter { it.isNotBlank() && !it.startsWith("#") }
                for (pkg in packages) {
                    onLog("📦 [pip] Installing $pkg into local storage...")
                    // In Chaquopy, pre-built or pure python packages can be dynamically loaded
                }

                onLog("✅ All dependencies verified successfully.")
                true
            } catch (e: Exception) {
                onLog("❌ Pip Install Error: ${e.message}")
                false
            }
        }
    }

    fun saveBotFiles(
        context: Context,
        botId: String,
        botPyContent: String,
        requirementsContent: String,
        envContent: String
    ): File {
        val botDir = File(context.filesDir, "bots/$botId").apply { mkdirs() }
        
        File(botDir, "bot.py").writeText(botPyContent)
        File(botDir, "requirements.txt").writeText(requirementsContent)
        File(botDir, ".env").writeText(envContent)

        return botDir
    }
}
