$configPath = "C:\Users\75815\AppData\Roaming\com.denglin.mojipc\config.json"
$config = Get-Content $configPath -Raw -Encoding UTF8 | ConvertFrom-Json
$encKey = $config.os_crypt.encrypted_key
$bytes = [Convert]::FromBase64String($encKey)
$dpapiBytes = $bytes[5..($bytes.Length-1)]
$decrypted = [System.Security.Cryptography.ProtectedData]::Unprotect($dpapiBytes, $null, [System.Security.Cryptography.DataProtectionScope]::CurrentUser)
[Convert]::ToBase64String($decrypted)
