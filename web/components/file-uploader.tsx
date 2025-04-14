"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, type File } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void
  maxFiles?: number
}

export function FileUploader({ onFileUpload, maxFiles = 10 }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).slice(0, maxFiles)
      onFileUpload(filesArray)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).slice(0, maxFiles)
      onFileUpload(filesArray)
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" multiple onChange={handleChange} className="hidden" />

      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Drag and drop files or click to upload</p>
          <p className="text-xs text-muted-foreground">
            Upload research papers, documents, or data files (max {maxFiles} files)
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleButtonClick}>
          Select Files
        </Button>
      </div>
    </div>
  )
}
