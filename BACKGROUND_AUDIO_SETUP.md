# Reprodução em Segundo Plano — Mamãe Zen (Nativo)

Este guia habilita a música tocando com a tela bloqueada no app iOS/Android via Capacitor.
Faça isso **uma única vez** após exportar o projeto para o GitHub.

## 1. Preparar

```bash
git pull
npm install
npx cap add ios       # se ainda não adicionou
npx cap add android   # se ainda não adicionou
npm run build
npx cap sync
```

## 2. iOS — editar `ios/App/App/Info.plist`

Adicione dentro da tag `<dict>` principal:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
</array>
```

Isso é **obrigatório**. Sem essa chave a Apple mata o áudio ao bloquear a tela.

## 3. iOS — configurar sessão de áudio

Abra `ios/App/App/AppDelegate.swift` e adicione no topo:

```swift
import AVFoundation
```

Dentro do método `application(_:didFinishLaunchingWithOptions:)`, antes do `return true`, adicione:

```swift
do {
    try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
    try AVAudioSession.sharedInstance().setActive(true)
} catch {
    print("AVAudioSession error: \(error)")
}
```

## 4. Android — editar `android/app/src/main/AndroidManifest.xml`

Dentro da tag `<manifest>` (fora de `<application>`) adicione:

```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

## 5. Sincronizar e rodar

```bash
npx cap sync
npx cap run ios      # ou
npx cap run android
```

## Validação

1. Abra o app no dispositivo real (emulador iOS **não** simula background audio).
2. Toque uma música na aba **Música**.
3. Bloqueie a tela do celular.
4. A música deve continuar tocando.
5. Nos controles do lockscreen deve aparecer "Mamãe Zen Music" com play/pause/stop.

## Sempre que atualizar o código

```bash
git pull && npm install && npm run build && npx cap sync
```
