/**
 * recorder.js
 * (c) 2022 Shuzhou Liu
 * Released under the Apache License 2.0. Partial rights reserved.
 */

class Recorder {
  constructor() {
    this.recorder = null;
    this.audio = null;
    this.audioContext = null;
    this.stream = null;
    this.isRecording = false;
  }
  start() {
    if (this.isRecording) {
      return;
    }
    this.isRecording = true;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.stream = stream;
      this.audioContext = new AudioContext();
      this.audio = this.audioContext.createMediaStreamSource(stream);
      this.recorder = new MediaRecorder(stream);
      this.recorder.start();
    });
  }
  stop() {
    if (!this.isRecording) {
      return;
    }
    this.isRecording = false;
    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());
  }
  ondataavailable(callback) {
    this.recorder.ondataavailable = callback;
  }
  onstop(callback) {
    this.recorder.onstop = callback;
  }
  getBlob() {
    return new Promise((resolve) => {
      this.ondataavailable((e) => {
        resolve(e.data);
      });
    });
  }
  getBuffer() {
    return new Promise((resolve) => {
      this.ondataavailable((e) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.readAsArrayBuffer(e.data);
      });
    });
  }
  play() {
    this.getBuffer().then((arrayBuffer) => {
      this.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
      });
    });
  }
  get raw() {
    // raw wav file
    return this.getBuffer().then((arrayBuffer) => {
      const buffer = new Uint8Array(arrayBuffer);
      const data = [];
      for (let i = 0; i < buffer.length; i++) {
        data.push(buffer[i]);
      }
      return data;
    });
  }
}
