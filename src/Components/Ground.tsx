function Ground() {
  return (
    <mesh rotation-x={-Math.PI *0.5} castShadow>
        <planeGeometry args={[30,30]} />

    </mesh>
  )
}

export default Ground