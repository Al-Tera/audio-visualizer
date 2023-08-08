import { useEffect } from "react"

interface Props {
  gltf: any
}

function Scene({gltf}: Props) {
  
  useEffect(()=>{
    if(gltf){
      const sortedArray = Object.values(gltf.scene.children).sort((a:any,b:any)=>
        a.name.slice(4)-b.name.slice(4)
      )
      gltf.scene.position.y = -5
      gltf.scene.children = sortedArray
    }
  },[gltf])

  return (
    <primitive object={gltf.scene} />
  )
}

export default Scene