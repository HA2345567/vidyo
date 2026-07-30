// @ts-expect-error - bun:test types are provided at runtime by bun test
import {expect, test} from 'bun:test'
import {formatBytes, formatDuration, formatSpeed, shortenPath, truncate, wrapText} from './format.js'

test('formatBytes formats bytes correctly', () => {
  expect(formatBytes(500)).toBe('500 B')
  expect(formatBytes(1500)).toBe('1.5 KB')
  expect(formatBytes(1048576 * 5)).toBe('5.0 MB')
  expect(formatBytes(0)).toBe('')
})

test('formatDuration formats seconds to MM:SS or HH:MM:SS', () => {
  expect(formatDuration(45)).toBe('0:45')
  expect(formatDuration(125)).toBe('2:05')
  expect(formatDuration(3665)).toBe('1:01:05')
})

test('truncate shortens string', () => {
  expect(truncate('hello world', 8)).toBe('hello w…')
  expect(truncate('hi', 5)).toBe('hi')
})

test('shortenPath shortens path', () => {
  expect(shortenPath('/Users/test/Downloads/video.mp4', '/Users/test', 30)).toBe('~/Downloads/video.mp4')
})

test('wrapText wraps words within width', () => {
  expect(wrapText('hello world test', 10)).toEqual(['hello', 'world test'])
})

test('formatSpeed formats speed correctly', () => {
  expect(formatSpeed(1048576)).toBe('1.0 MB/s')
})
