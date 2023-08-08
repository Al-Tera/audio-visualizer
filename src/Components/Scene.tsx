import { useRef } from 'react'

interface Props {
  gltf: any
}

function Scene({gltf}: Props) {
  const modelRef = useRef()
  
  return (
    <primitive object={gltf.scene} ref={modelRef} />
  )
}

export default Scene