import {useState, useEffect, useCallback, useRef} from 'react'
import {Box, Text, useApp, useInput} from 'ink'
import SelectInput from 'ink-select-input'
import Spinner from 'ink-spinner'

import {FullScreen} from './components/fullscreen.js'
import {Logo} from './components/logo.js'
import {Panel} from './components/pannel.js'
import {FramedInput} from './components/framed-input.js'
import {ProgressBar} from './components/progress-bar.js'
import {Shortcuts} from './components/shortcuts-bar.js'
import {TextInput} from './components/text-input.js'
import {ThemeProvider, useTheme, nextThemeMode, type ThemeMode} from './theme.js'

import {
  ensureYtDlp,
  findFfmpeg,
  probe,
  buildChoices,
  download,
  type VideoInfo,
  type DownloadChoice,
  type DownloadProgress,
} from './lib/ytdlp.js'
import {loadHistory, addToHistory} from './lib/history.js'
import {readClipboard} from './lib/clipboard.js'
import {detectPlatform, isProbablyUrl} from './lib/platform.js'
import {formatDuration, shortenPath, formatBytes, formatSpeed, formatEta} from './lib/format.js'
import {useMouseClick} from './lib/use-mouse-click.js'
import {clickTargetAt} from './lib/click-map.js'
import os from 'node:os'

type Screen = 'input' | 'probing' | 'choice' | 'downloading' | 'complete' | 'error'

interface AppProps {
  initialUrl?: string
  initialTheme?: ThemeMode
}

function MainApp({initialUrl}: {initialUrl?: string}) {
  const {exit} = useApp()
  const theme = useTheme()
  const [screen, setScreen] = useState<Screen>(initialUrl ? 'probing' : 'input')
  const [url, setUrl] = useState(initialUrl ?? '')
  const [statusMessage, setStatusMessage] = useState('Initializing...')
  const [history, setHistory] = useState<string[]>([])
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [infoJsonPath, setInfoJsonPath] = useState<string>('')
  const [choices, setChoices] = useState<DownloadChoice[]>([])
  const [progress, setProgress] = useState<DownloadProgress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [savedPath, setSavedPath] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const ytdlpPathRef = useRef<string | null>(null)
  const ffmpegPathRef = useRef<string | undefined>(undefined)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const startProbe = useCallback(async (targetUrl: string) => {
    if (!targetUrl.trim()) return
    setScreen('probing')
    setStatusMessage('Checking dependencies...')
    setErrorMessage('')
    setUrl(targetUrl)

    try {
      const ac = new AbortController()
      abortControllerRef.current = ac

      if (!ytdlpPathRef.current) {
        ytdlpPathRef.current = await ensureYtDlp(msg => setStatusMessage(msg), ac.signal)
      }
      if (ffmpegPathRef.current === undefined) {
        ffmpegPathRef.current = await findFfmpeg()
      }

      setStatusMessage(`Fetching video info for ${detectPlatform(targetUrl).label}...`)
      const res = await probe(ytdlpPathRef.current, targetUrl, ac.signal)
      setVideoInfo(res.info)
      setInfoJsonPath(res.infoJsonPath)

      const availableChoices = buildChoices(res.info)
      setChoices(availableChoices)
      setHistory(addToHistory(targetUrl))
      setScreen('choice')
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setErrorMessage(err instanceof Error ? err.message : String(err))
      setScreen('error')
    }
  }, [])

  useEffect(() => {
    if (initialUrl) {
      void startProbe(initialUrl)
    }
  }, [initialUrl, startProbe])

  const handleSelectChoice = useCallback(
    async (item: {value: DownloadChoice}) => {
      const choice = item.value
      setScreen('downloading')
      setProgress(null)
      setIsProcessing(false)

      try {
        const ac = new AbortController()
        abortControllerRef.current = ac

        const outDir = process.env.DOWNLOAD_DIR || os.homedir()

        const finalPath = await download(
          {
            ytdlp: ytdlpPathRef.current!,
            ffmpegLocation: ffmpegPathRef.current,
            url,
            infoJsonPath,
            choice,
            outDir,
          },
          {
            onProgress: p => setProgress(p),
            onProcessing: () => setIsProcessing(true),
          },
          ac.signal,
        )

        setSavedPath(finalPath)
        setScreen('complete')
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setErrorMessage(err instanceof Error ? err.message : String(err))
        setScreen('error')
      }
    },
    [url, infoJsonPath],
  )

  const urlRef = useRef(url)
  urlRef.current = url

  useMouseClick((x, y) => {
    if (screen === 'input') {
      const hit = clickTargetAt(x, y, [
        {
          match: 'Enter',
          action: () => {
            const current = urlRef.current
            if (current.trim()) void startProbe(current)
          },
        },
      ])
      hit?.action()
    }
  }, screen === 'input')

  useInput((input, key) => {
    if (key.escape) {
      if (screen === 'probing' || screen === 'downloading') {
        abortControllerRef.current?.abort()
      }
      if (screen !== 'input') {
        setScreen('input')
      } else {
        exit()
      }
      return
    }

    if (screen === 'input') {
      if (input === 'c' && !urlRef.current) {
        const pasted = readClipboard()
        if (pasted && isProbablyUrl(pasted)) {
          setUrl(pasted)
        }
      }
    } else if (screen === 'complete' || screen === 'error') {
      if (key.return || input === '\r' || input === '\n' || input === ' ') {
        setScreen('input')
        setUrl('')
      }
    }
  })

  return (
    <FullScreen>
      <Box flexDirection="column" alignItems="center" width={64}>
        <Logo />
        <Box height={1} />

        {screen === 'input' && (
          <Box flexDirection="column" width={60}>
            <FramedInput title="Paste a video link" width={60} button="Enter">
              <TextInput
                value={url}
                onChange={setUrl}
                onSubmit={val => void startProbe(val)}
                placeholder="https://..."
                width={50}
                history={history}
                submitOnPaste={val => isProbablyUrl(val)}
              />
            </FramedInput>
            <Box height={1} />
            <Shortcuts
              items={[
                ['c', 'paste clipboard'],
                ['↑/↓', 'history'],
                ['esc', 'exit'],
              ]}
            />
          </Box>
        )}

        {screen === 'probing' && (
          <Panel title="Analyzing video..." width={60}>
            <Box paddingY={1}>
              <Text color={theme.info}>
                <Spinner type="dots" />
              </Text>
              <Text> {statusMessage}</Text>
            </Box>
            <Shortcuts items={[['esc', 'cancel']]} />
          </Panel>
        )}

        {screen === 'choice' && videoInfo && (
          <Panel title={videoInfo.title || 'Select format'} width={60}>
            <Box flexDirection="column" paddingY={1}>
              {videoInfo.uploader && (
                <Text color={theme.secondary}>
                  Uploader: <Text color={theme.primary}>{videoInfo.uploader}</Text>
                </Text>
              )}
              {videoInfo.duration && (
                <Text color={theme.secondary}>
                  Duration: <Text color={theme.primary}>{formatDuration(videoInfo.duration)}</Text>
                </Text>
              )}
              <Box height={1} />
              <Text bold color={theme.primary}>
                Select download option:
              </Text>
              <SelectInput
                items={choices.map((c, index) => ({
                  key: `${c.kind}-${c.label}-${index}`,
                  label: c.label,
                  value: c,
                }))}
                onSelect={handleSelectChoice}
              />
            </Box>
            <Shortcuts
              items={[
                ['↑/↓', 'navigate'],
                ['enter', 'select'],
                ['esc', 'back'],
              ]}
            />
          </Panel>
        )}

        {screen === 'downloading' && (
          <Panel title={isProcessing ? 'Processing video...' : 'Downloading video...'} width={60}>
            <Box flexDirection="column" paddingY={1}>
              {isProcessing ? (
                <Box>
                  <Text color={theme.warning}>
                    <Spinner type="dots" />
                  </Text>
                  <Text> Merging formats / extracting audio...</Text>
                </Box>
              ) : (
                <>
                  <ProgressBar percent={(progress?.downloadedBytes ?? 0) / (progress?.totalBytes || 1)} width={40} />
                  <Box height={1} />
                  <Box justifyContent="space-between">
                    <Text color={theme.secondary}>
                      {formatBytes(progress?.downloadedBytes ?? 0)}
                      {progress?.totalBytes ? ` / ${formatBytes(progress.totalBytes)}` : ''}
                    </Text>
                    {progress?.speed ? <Text color={theme.secondary}>{formatSpeed(progress.speed)}</Text> : null}
                    {progress?.eta ? <Text color={theme.secondary}>ETA: {formatEta(progress.eta)}</Text> : null}
                  </Box>
                </>
              )}
            </Box>
            <Shortcuts items={[['esc', 'cancel']]} />
          </Panel>
        )}

        {screen === 'complete' && (
          <Panel title="Download finished!" width={60}>
            <Box flexDirection="column" paddingY={1}>
              <Text color={theme.success}>Saved to:</Text>
              <Text color={theme.primary}>{shortenPath(savedPath, os.homedir())}</Text>
            </Box>
            <Shortcuts
              items={[
                ['enter', 'download another'],
                ['esc', 'exit'],
              ]}
            />
          </Panel>
        )}

        {screen === 'error' && (
          <Panel title="Error" width={60}>
            <Box flexDirection="column" paddingY={1}>
              <Text color={theme.error}>{errorMessage}</Text>
            </Box>
            <Shortcuts
              items={[
                ['enter', 'try again'],
                ['esc', 'exit'],
              ]}
            />
          </Panel>
        )}
      </Box>
    </FullScreen>
  )
}

export default function App({initialUrl, initialTheme = 'auto'}: AppProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme)

  useInput(input => {
    if (input === 't') {
      setThemeMode(prev => nextThemeMode(prev))
    }
  })

  return (
    <ThemeProvider mode={themeMode}>
      <MainApp initialUrl={initialUrl} />
    </ThemeProvider>
  )
}
