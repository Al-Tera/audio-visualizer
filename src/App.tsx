import { Canvas, useLoader } from '@react-three/fiber'
import './App.scss'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { ChangeEvent, Suspense, useEffect, useRef, useState } from 'react'
import Scene from './Components/Scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const View = () => {
  return (
    <>
      <OrbitControls target={[0,0.35,0]} maxPolarAngle={1.45} />
      <PerspectiveCamera makeDefault fov={50} position={[0,10,20]} rotation={[262,125,42]} />
      <pointLight position={[0, 20, 0]} intensity={1000.5} />
      <pointLight position={[0, 20, 50]} intensity={1000.5} />
    </>
  )
}

function App() {
  const gltf = useLoader(GLTFLoader, '../public/MusicSquare.gltf')
  
  const [audioFile, setAudioFile] = useState<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  let animationRef = useRef<number>(0);

  const audioContext = new AudioContext();
  const audioAnalyzer = audioContext.createAnalyser()
  audioAnalyzer.connect(audioContext.destination)
  audioAnalyzer.fftSize = 64
  let newAudioSource:MediaElementAudioSourceNode;

  const handleFileUpload = (event:ChangeEvent<HTMLInputElement>) =>{
    const file = event?.target?.files?.[0];
    if(file) setAudioFile({name: file.name, file: URL.createObjectURL(file), type: file.type})
  }

  useEffect(()=>{
    if(gltf){
      const sortedArray = Object.values(gltf.scene.children).sort((a:any,b:any)=>
        a.name.slice(4)-b.name.slice(4)
      )
      gltf.scene.position.y = -5
      gltf.scene.children = sortedArray
    }
  },[gltf])

  const handleAudioVisualizer = () => {
    if(audioFile && audioRef.current){
      if(!newAudioSource){
        newAudioSource = audioContext.createMediaElementSource(audioRef.current)
        newAudioSource.connect(audioAnalyzer)
      }
      const bufferLength = audioAnalyzer.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      const sceneChildren = gltf.scene.children
      
      const animate = () => {
        audioAnalyzer.getByteFrequencyData(dataArray)
        for(let i=0; i<bufferLength; i++){
          if(sceneChildren[i]){
            if(dataArray[i]*.1<1) sceneChildren[i].scale.y = 1
            else sceneChildren[i].scale.y = (dataArray[i] * .1).toFixed(3)
          }
        }
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    }
  }

  const handleEnd = () => {
    cancelAnimationFrame(animationRef.current)
  }

  return (
    <>
      <div className='audio__container'>
        <label htmlFor='audio1' className='label__audio'>Upload Audio</label>
        {
          audioFile?.name &&
          <p>{audioFile.name}</p>
        }
        <input  type="file" id="audio1" accept="audio/*" onChange={handleFileUpload} />
          {
            audioFile && 
            <audio ref={audioRef} controls key={audioFile && audioFile.file} onPause={handleEnd} onPlay={handleAudioVisualizer} onEnded={handleEnd} >
            <source src={audioFile.file} type={audioFile.type} />
        </audio>
          }
      </div>
      <Suspense>
        <Canvas className='the__canvas' shadows>
          <View />
          {/* <Model /> */}
          <Scene gltf={gltf} />
        </Canvas>
      </Suspense>
    </>
  )
}

export default App
