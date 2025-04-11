import * as THREE from 'three'

const colors = {
  blue: new THREE.MeshBasicMaterial({ color: '#219ebc' }),
  green: new THREE.MeshBasicMaterial({ color: '#80ed99' }),
  orange: new THREE.MeshBasicMaterial({ color: '#f77f00' }),
};

export const TYPE = {
  SPHERE: 1,
  POLYGON: 2,
  BONUS: 3
};

const SCREEN_LIMIT = {
  LEFT: -15,
  RIGHT: 15
};

export const getTarget = (type)=>{

  let mesh;

  switch(type){

    case TYPE.SPHERE:
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        colors.blue
      );
      mesh.userData ={
        gain: 10,
        speed: 1
      };
      break;

    case TYPE.POLYGON:
      mesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.3),
        colors.green
      );
      mesh.userData ={
        gain: 50,
        speed: 2
      };
      break;

    case TYPE.BONUS:
      mesh = new THREE.Mesh(
        new THREE.ConeGeometry( .2, .3),
        colors.orange
      );
      mesh.userData = {
        gain: 100,
        speed: 3
      };
  }
  
  return mesh;
};

function getRandomInt(max){
  return Math.round(Math.random() * max);
}

export const respawn = (target) => {
  target.position.set(
      SCREEN_LIMIT.LEFT - Math.random() * 5,
      (Math.random() * 10) - 5,
      0
  );
};