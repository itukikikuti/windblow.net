---
layout: post
title: Windows APIでウィンドウを出す
category: DirectX11
date: 2018-11-03 00:00:00
---

最初はウィンドウを出してみましょう。ウィンドウがないとゲームで何が起こってるのか全然わかりませんからね。Visual StudioでC++の空のプロジェクトを作ってください。それからSource.cppというファイルを作ってください。別にSource.cppという名前じゃなくてもいいですけどね。

<small>Source.cpp</small>
``` cpp
int main()
{
    return 0;
}
```

これがC++における最小のコードですよね。このmain関数がエントリーポイントと言ってプログラムのスタート地点です。知らない人の為に全部説明していきますよ！実行したらコンソールウィンドウが出ます。

さて、Windows APIではCreateWindow関数でウィンドウを作ってShowWindow関数でウィンドウを表示するとウィンドウを出せます、ざっくりいうと。

<small>Source.cpp</small>
``` cpp
#define OEMRESOURCE
#include <Windows.h>

int main()
{
    HINSTANCE instance = GetModuleHandleW(nullptr);

    WNDCLASSW windowClass = {};
    windowClass.lpfnWndProc = DefWindowProcW;
    windowClass.hInstance = instance;
    windowClass.hCursor = (HCURSOR)LoadImageW(nullptr, MAKEINTRESOURCEW(OCR_NORMAL), IMAGE_CURSOR, 0, 0, LR_SHARED);
    windowClass.lpszClassName = L"GameLib";
    RegisterClassW(&windowClass);

    HWND handle = CreateWindowW(L"GameLib", L"GameLib", WS_OVERLAPPEDWINDOW, 0, 0, 640, 480, nullptr, nullptr, instance, nullptr);

    ShowWindow(handle, SW_SHOWNORMAL);

    return 0;
}
```

具体的にはこんな感じのコードを書きます。へぇこう書くのか、くらいに思っとけば大丈夫です。ぶっちゃけ私も定型文くらいにしか考えてませんし、全部覚えてないので書くときは自分の過去のコードとか見て書きます。Windows APIを使うのでWindows.hをインクルードします。#define OEMRESOURCEというのは、LoadImageW関数に渡しているOCR_NORMALを使えるようにするためのものです。

そしてメインループというものも書きます。ゲームループと言ったりもします。メインループがないとウィンドウが出たと同時にアプリケーションが終わってウィンドウも消えてしまいます。

``` cpp
    …
    ShowWindow(handle, SW_SHOWNORMAL);

    while (true)
    {
        MSG message = {};

        if (PeekMessageW(&message, nullptr, 0, 0, PM_REMOVE))
        {
            if (message.message == WM_QUIT)
                break;

            TranslateMessage(&message);
            DispatchMessageW(&message);
        }
        else
        {
            // ここにゲームの処理を書いていく
        }
    }

    return 0;
}
```

ShowWindow関数の下にメインループの下にメインループを書きました。return 0;は一番最後の行にないとダメです。メインループの前にreturn 0;があるとメインループの前にアプリケーションが終わるので意味が無いです。PeekMessageW関数とかTranslateMessage関数とかDispatchMessageW関数はウィンドウメッセージの処理です。これをしないとウィンドウを動かしたり、大きさを変えたり出来ません。実行してみましょう！ウィンドウ出ましたね！

コンソールウィンドウを消す方法もあります。実はWindowsのアプリケーション専用のエントリーポイントというものがあって、int main()をint APIENTRY wWinMain(HINSTANCE, HINSTANCE, LPWSTR, int)に変えて実行すると普通のウィンドウだけ出せます。このWinMainというのがWindows専用のエントリーポイントです。

さて、ウィンドウのサイズを幅640ピクセル、高さ480ピクセルにしてるんですが、実は出来てないんです。640x480という風にしてしまうと、ウィンドウのタイトルバーとかウィンドウの枠とかも含めて、640x480になってしまうんです。それに、ウィンドウの位置も左上になってしまってますから、中央にしたほうが良いです。SetWindowPos関数を使えばウィンドウの位置と大きさを変えられます。

``` cpp
    …
    HWND handle = CreateWindowW(L"GameLib", L"GameLib", WS_OVERLAPPEDWINDOW, 0, 0, 0, 0, nullptr, nullptr, instance, nullptr);

    RECT windowRect = {};
    RECT clientRect = {};
    GetWindowRect(handle, &windowRect);
    GetClientRect(handle, &clientRect);

    int w = (windowRect.right - windowRect.left) - (clientRect.right - clientRect.left) + 640;
    int h = (windowRect.bottom - windowRect.top) - (clientRect.bottom - clientRect.top) + 480;
    int x = (GetSystemMetrics(SM_CXSCREEN) - w) / 2;
    int y = (GetSystemMetrics(SM_CYSCREEN) - h) / 2;

    SetWindowPos(handle, nullptr, x, y, w, h, SWP_FRAMECHANGED);

    ShowWindow(handle, SW_SHOWNORMAL);
    …
```

こんな感じでCreateWindowW関数の下に書きました。位置と大きさの計算がちょっとややこしいですね。CreateWindowW関数に渡していた0, 0, 640, 480は0, 0, 0, 0に変えてます。

あとはウィンドウプロシージャーも書いておきましょう。今はウィンドウの右上のＸボタンを押してもアプリケーションが終わりません。ウィンドウプロシージャを書けばそれが治ります。

``` cpp
LRESULT CALLBACK ProceedMessage(HWND window, UINT message, WPARAM wParam, LPARAM lParam)
{
    if (message == WM_DESTROY)
        PostQuitMessage(0);

    return DefWindowProcW(window, message, wParam, lParam);
}
```

こういう関数を書いてwindowClass.lpfnWndProc = DefWindowProcW;をwindowClass.lpfnWndProc = ProceedMessage;にすれば出来ます。DefWindowProcW関数はデフォルトで用意してあるウィンドウプロシージャです。それとは別に自分でウィンドウプロシージャを用意できます。それが上の関数です。自分でウィンドウプロシージャを書くと例えばウィンドウの大きさが変わったらこうするとかウィンドウが消えたらどうするとか自分で処理を追加出来ます。

では、今までのコードをクラスにしてみましょう。Window.hppとWindow.cppというファイルを作ってください。

<small>Window.hpp</small>
``` cpp
#pragma once
#define OEMRESOURCE
#include <Windows.h>
#include <DirectXMath.h>

class Window
{
public:
    static void Initialize();
    static HWND GetHandle();
    static DirectX::XMINT2 GetSize();
    static void SetSize(int width, int height);
    static bool Update();

private:
    static const wchar_t* name;
    static HWND handle;

    static LRESULT CALLBACK ProceedMessage(HWND window, UINT message, WPARAM wParam, LPARAM lParam);
};
```

<small>Window.cpp</small>
``` cpp
#include "Window.hpp"

const wchar_t* Window::name = L"GameLib";
HWND Window::handle;

void Window::Initialize()
{
    HINSTANCE instance = GetModuleHandleW(nullptr);

    WNDCLASSW windowClass = {};
    windowClass.lpfnWndProc = ProceedMessage;
    windowClass.hInstance = instance;
    windowClass.hCursor = (HCURSOR)LoadImageW(nullptr, MAKEINTRESOURCEW(OCR_NORMAL), IMAGE_CURSOR, 0, 0, LR_SHARED);
    windowClass.lpszClassName = name;
    RegisterClassW(&windowClass);

    handle = CreateWindowW(name, name, WS_OVERLAPPEDWINDOW, 0, 0, 0, 0, nullptr, nullptr, instance, nullptr);

    SetSize(640, 480);

    ShowWindow(handle, SW_SHOWNORMAL);
}

HWND Window::GetHandle()
{
    return handle;
}

DirectX::XMINT2 Window::GetSize()
{
    RECT clientRect = {};
    GetClientRect(handle, &clientRect);

    return DirectX::XMINT2(clientRect.right - clientRect.left, clientRect.bottom - clientRect.top);
}

void Window::SetSize(int width, int height)
{
    RECT windowRect = {};
    RECT clientRect = {};
    GetWindowRect(handle, &windowRect);
    GetClientRect(handle, &clientRect);

    int w = (windowRect.right - windowRect.left) - (clientRect.right - clientRect.left) + width;
    int h = (windowRect.bottom - windowRect.top) - (clientRect.bottom - clientRect.top) + height;
    int x = (GetSystemMetrics(SM_CXSCREEN) - w) / 2;
    int y = (GetSystemMetrics(SM_CYSCREEN) - h) / 2;

    SetWindowPos(handle, nullptr, x, y, w, h, SWP_FRAMECHANGED);
}

bool Window::Update()
{
    MSG message = {};

    while (PeekMessageW(&message, nullptr, 0, 0, PM_REMOVE))
    {
        if (message.message == WM_QUIT)
            return false;

        TranslateMessage(&message);
        DispatchMessageW(&message);
    }

    return true;
}

LRESULT CALLBACK Window::ProceedMessage(HWND window, UINT message, WPARAM wParam, LPARAM lParam)
{
    if (message == WM_DESTROY)
        PostQuitMessage(0);

    return DefWindowProcW(window, message, wParam, lParam);
}
```

<small>Source.cpp</small>
``` cpp
#include "Window.hpp"

int APIENTRY wWinMain(HINSTANCE, HINSTANCE, LPWSTR, int)
{
    Window::Initialize();

    while (Window::Update())
    {
        // ここにゲームの処理を書いていく
    }

    return 0;
}
```

こんな感じでクラス化してみました。Initialize関数でウィンドウ出して、Update関数がメインループを回してます。Window::GetHandle関数とかWindow::GetSize関数は他のところで使いそうなので書いておきました。
ダウンロードしたい人はGitHubに[サンプルリポジトリ](https://github.com/itukikikuti/DirectX11Sample)があるので、ぜひダウンロードしてください。
