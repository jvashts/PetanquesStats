$ErrorActionPreference = 'Stop'
$dir = Join-Path $PSScriptRoot '..\icons'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Add-Type -AssemblyName System.Drawing

function New-BoulesIcon([int]$px) {
  $bmp = New-Object System.Drawing.Bitmap $px, $px
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::FromArgb(15, 15, 26))
  $dia = [int][Math]::Round($px * 0.55)
  $cx = $px / 2.0
  $cy = $px / 2.0
  $x = [int][Math]::Round($cx - $dia / 2.0)
  $y = [int][Math]::Round($cy - $dia / 2.0)
  $boule = New-Object System.Drawing.Drawing2D.GraphicsPath
  $boule.AddEllipse($x, $y, $dia, $dia)
  $rect = New-Object System.Drawing.Rectangle $x, $y, $dia, $dia
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(230, 212, 165, 116),
    [System.Drawing.Color]::FromArgb(255, 140, 100, 60),
    [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
  $g.FillPath($brush, $boule)
  $w = [Math]::Max(1, [int][Math]::Round($px / 64.0))
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(180, 80, 60, 40)), $w
  $g.DrawPath($pen, $boule)
  $g.Dispose()
  $path = Join-Path $dir "icon-$px.png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

New-BoulesIcon 192
New-BoulesIcon 512
Write-Host "Wrote icons to $dir"
