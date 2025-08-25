import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Volume2, Type, Palette, Download, Upload } from "lucide-react";
import { useProgress, useUserSettings } from "@/store/progress";

const Settings = () => {
  const { updateSettings } = useProgress();
  const settings = useUserSettings();

  const handleAudioRateChange = (value: number[]) => {
    updateSettings({ audioRate: value[0] });
  };

  const handleTextScaleChange = (value: number[]) => {
    updateSettings({ textScale: value[0] });
  };

  const handleThemeChange = (theme: 'system' | 'light' | 'dark') => {
    updateSettings({ theme });
    
    // Apply theme immediately
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2">設定</h1>
        <p className="text-muted-foreground">
          アプリの動作をカスタマイズできます
        </p>
      </div>

      {/* Audio Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            音声設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">再生速度</label>
              <span className="text-sm text-muted-foreground">{settings.audioRate.toFixed(1)}x</span>
            </div>
            <Slider
              value={[settings.audioRate]}
              onValueChange={handleAudioRateChange}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">自動再生</label>
              <p className="text-xs text-muted-foreground">カード表示時に音声を自動再生</p>
            </div>
            <Switch
              checked={settings.autoPlay}
              onCheckedChange={(checked) => updateSettings({ autoPlay: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            表示設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">文字サイズ</label>
              <span className="text-sm text-muted-foreground">{Math.round(settings.textScale * 100)}%</span>
            </div>
            <Slider
              value={[settings.textScale]}
              onValueChange={handleTextScaleChange}
              min={0.75}
              max={1.5}
              step={0.05}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">テーマ</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'system', label: 'システム' },
                { value: 'light', label: 'ライト' },
                { value: 'dark', label: 'ダーク' }
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={settings.theme === value ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange(value as any)}
                  className="justify-center"
                >
                  {label}
                  {settings.theme === value && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      選択中
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            システム設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">振動フィードバック</label>
              <p className="text-xs text-muted-foreground">正解・不正解時のバイブレーション</p>
            </div>
            <Switch
              checked={settings.vibration}
              onCheckedChange={(checked) => updateSettings({ vibration: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">インターフェース言語</label>
              <p className="text-xs text-muted-foreground">アプリの表示言語</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={settings.language === 'ja' ? "primary" : "outline"}
                size="sm"
                onClick={() => updateSettings({ language: 'ja' })}
              >
                日本語
              </Button>
              <Button
                variant={settings.language === 'en' ? "primary" : "outline"}
                size="sm"
                onClick={() => updateSettings({ language: 'en' })}
                disabled
              >
                English
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            データ管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            学習データのバックアップと復元ができます（近日公開予定）
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              データをエクスポート
            </Button>
            <Button variant="outline" disabled>
              <Upload className="h-4 w-4 mr-2" />
              データをインポート
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="shadow-card">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Pocket Russian Trainer</h3>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground mt-2">
            教科書「これからはじめる ロシア語入門」対応学習アプリ
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;