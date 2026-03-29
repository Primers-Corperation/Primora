Add-Type -AssemblyName PresentationFramework
[xml]$test = Get-Content 'c:\Users\jerry\OneDrive\Documents\DS4Windows\PrimoraApp\PrimoraForms\Themes\DefaultTheme.xaml'
try {
    $reader = New-Object System.Xml.XmlNodeReader $test
    [System.Windows.Markup.XamlReader]::Load($reader)
    Write-Output "XAML Valid."
} catch {
    Write-Output "Exception: $_"
}
