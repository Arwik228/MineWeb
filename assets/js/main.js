const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
var allInterval = [];
const audio1 = new Audio(), audio2 = new Audio(), audio3 = new Audio();
audio1.src = 'https://static.wikia.nocookie.net/minecraft_ru_gamepedia/images/a/aa/Grass_hit1.ogg';
audio2.src = 'https://static.wikia.nocookie.net/minecraft_ru_gamepedia/images/7/71/Grass_hit2.ogg';
audio3.src = 'https://static.wikia.nocookie.net/minecraft_ru_gamepedia/images/e/e0/Grass_hit3.ogg';
const allMusic = [audio1, audio2, audio3]

const NewGame = () => {
  scene.background = new THREE.Color("#153b84");
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 32);
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  camera.rotation.order = 'YXZ';
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 0;
  camera.position.y = 8; camera.position.x = 0;
  document.oncontextmenu = function () { return false };
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var chanks = [], scope = 0, gameover = false;
  var oldMousePosition = { x: 0, y: 0 };

  new Promise((resolve, reject) => {
    //loading texture// 
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext("2d"),
      parts = [],
      img = new Image();
    function split_4() {
      let w2 = img.width / 16, h2 = img.height / 16;
      for (let h = 0; h > -img.height; h -= 32) {
        for (let w = 0; w > -img.width; w -= 32) {
          canvas.width = w2;
          canvas.height = h2;
          ctx.drawImage(this, w, h, w2 * 16, h2 * 16);
          parts.push(canvas.toDataURL());
        }
      }
      for (let i = 0; i < parts.length; i++) {
        var slicedImage = document.createElement("img");
        slicedImage.id = `gameBlock_${i + 1}`
        slicedImage.src = parts[i];
        var div = document.getElementById("test");
        div.appendChild(slicedImage);
      }
    };
    img.onload = split_4;
    img.src = document.getElementById("textureCode").getAttribute("src");
    resolve("result")
    //loading texture//
  }).then(() => {
    let def = setInterval(() => {
      if (document.getElementById(`gameBlock_255`).getAttribute("src")) {
        clearInterval(def);
        let fly = false, space = false;
        //gravity player
        (() => {
          let gravity = new THREE.Raycaster()
          let gravitationInterval = setInterval(() => {
            if (!fly && !space) {
              gravity.set(camera.position, new THREE.Vector3(0, -1, 0));
              try {
                let intersects = gravity.intersectObjects(scene.children, true);
                if (intersects[0]) {
                  if (intersects[0].distance > 2) {
                    camera.position.y -= 0.3
                  }
                } else {
                  camera.position.y -= 0.3
                }
              } catch{ }
              if (camera.position.y < -20) {
                document.getElementById("scope").innerHTML = scope;
                document.getElementsByClassName("gameover")[0].style.display = "block";
                clearInterval(gravitationInterval);
                gameover = true;
              }
            }
            document.getElementById("position").innerHTML = `Position(x,y,z): ${Math.floor(camera.position.x)}/${Math.floor(camera.position.z)}/${Math.floor(camera.position.y)}`;
          }, 10)
        })();
        //gravity player

        //background change//
        (() => {
          let backgroundColor = ["05132b", "081b3d", "0a214b", "0c2554", "0f2d65", "153b84", "153b84", "153b84", "0c2554", "0a214b", "081b3d", "05132b", "05132b"]
          let gameTime = {
            hour: 12,
            minute: 0
          }
          let gameTimeInterval = setInterval(() => {
            if (gameTime.hour < 24) {
              if (gameTime.minute < 59) {
                gameTime.minute += 1
              } else {
                gameTime.hour += 1;
                gameTime.minute = 0
              }
            } else {
              gameTime.hour = 0;
            }
            try {
              scene.background = new THREE.Color('#' + backgroundColor[Math.floor(gameTime.hour / 2)]);
            } catch{ }
            document.getElementById("chunks").innerHTML = `ChunksLoad: ${chanks.length}`;
            document.getElementById("gametime").innerHTML = `GameTime: ${gameTime.hour}:${gameTime.minute < 10 ? '0' + gameTime.minute : gameTime.minute}`;
          }, 288);
          allInterval.push(gameTimeInterval)
        })();
        //background change//

        //control keys//
        (() => {
          window.addEventListener('mousemove', (event) => {
            if (!gameover) {
              let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
              let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
              camera.rotation.x += -movementY * Math.PI / 180;
              camera.rotation.y -= movementX * Math.PI / 180
              camera.rotation.x = Math.min(Math.max(camera.rotation.x, -1.0472), 1.0472);
              oldMousePosition.x = event.clientX;
              oldMousePosition.y = event.clientY;
              mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
              mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
              raycaster.setFromCamera(mouse, camera);
              var intersects = raycaster.intersectObjects(scene.children, true);
              if (intersects[0]) {
                document.getElementById("selectBlock").innerHTML =
                  `SelectBlock(x,y,z):  ${Math.floor(intersects[0].object.position.x)}/` +
                  `${Math.floor(intersects[0].object.position.z)}/` +
                  `${Math.floor(intersects[0].object.position.y)}`;
              } else {
                document.getElementById("selectBlock").innerHTML = `SelectBlock(x,y,z): 0/0/0`;
              }
            }
          }, false);

          document.body.addEventListener("click", () => {
            raycaster.setFromCamera(mouse, camera);
            var intersects = raycaster.intersectObjects(scene.children);
            if (intersects[0]) {
              if (Math.abs(camera.position.x - intersects[0].point.x) < 9 && Math.abs(camera.position.z - intersects[0].point.z) < 9 && Math.abs(camera.position.y - intersects[0].point.y) < 9) {
                scene.remove(intersects[0].object);

                scope++;
              }
            }
          });

          const randomAudio = () => {
            allMusic[Math.floor(Math.random() * Math.floor(3))].play()
          }

          (() => {
            let lastChar = undefined; let clearchar = undefined;
            document.body.onkeyup = (e) => {
              clearInterval(clearchar)
              if (e.keyCode == 32) {
                if (lastChar != 32) {
                  space = true;
                  camera.position.y += 2;
                  setTimeout(() => { space = false; }, 200);
                }
                clearchar = setTimeout(() => {
                  lastChar = undefined;
                }, 300);
              }
              if (lastChar == 32) {
                fly = !fly;
                document.getElementById("flystatus").innerHTML = `Fly Status: ${fly}`;
                lastChar = undefined;
              } else {
                lastChar = e.keyCode;
              }
            }

            document.body.onkeydown = (e) => {
              if (!gameover) {
                if (e.keyCode == 32) {
                  if (fly) {
                    camera.position.y += 0.5;
                  }
                }
                if (e.keyCode == 16) { if (fly) { camera.position.y -= 0.5; } }
                let fixidY = camera.position.y;
                if (e.keyCode == 87) {
                  camera.translateZ(-0.3);
                  camera.position.y = fixidY;
                  if (!fly) { randomAudio(); }
                } else if (e.keyCode == 65) {
                  camera.translateX(-0.3);
                  camera.position.y = fixidY;
                  if (!fly) { randomAudio(); }
                } else if (e.keyCode == 68) {
                  camera.translateX(0.3);
                  camera.position.y = fixidY;
                  if (!fly) { randomAudio(); }
                } else if (e.keyCode == 83) {
                  camera.translateZ(0.3);
                  camera.position.y = fixidY;
                  if (!fly) { randomAudio(); }
                }
              }
            }
          })()

          var setblock = 1;
          (() => {
            let ignoreBlock = [
              6, 10, 11, 22, 27, 28, 31, 32, 39, 40, 41,
              46, 48, 58, 59, 60, 63, 70, 71, 72, 76, 77,
              82, 83, 84, 85, 86, 87, 89, 90, 91, 92, 93,
              94, 95, 97, 98, 99, 100, 103, 109, 110, 111,
              113, 119, 123, 124, 125, 128, 132, 135, 136,
              137, 140, 141, 144, 148, 149, 150, 151, 152,
              156, 157, 158, 160, 169, 170, 171, 173, 174,
              175, 181, 182, 184, 186, 187, 188, 189, 190,
              191, 192, 217, 218, 219, 220, 221, 222, 232,
              233, 234, 235, 236, 237, 241, 242, 243, 244,
              245, 246, 247, 248, 249, 250, 251, 252, 253,
              254, 255, 42, 43, 153, 112, 79
            ];
            let storageRoot = document.getElementById("test");
            for (let i = 1; i < storageRoot.childElementCount; i++) {
              if (!ignoreBlock.includes(i)) {
				  let localElem = document.getElementById(`gameBlock_${i}`);
				  if(localElem){
					  localElem.setAttribute("class", "allow_block");
				  }
              }
            }
          })();

          const fixTextureFunction = (allowBlock) => {
            let arrayTexture = [
              { allowBlock: 3, absoluteTexture: [4, 4, [41, "#bfb755"], 4, 4, 4] }, { allowBlock: 7, absoluteTexture: [9, 9, 10, 9, 9, 9] },
              { allowBlock: 11, absoluteTexture: [208, 208, 208, 208, 208, 208] }, { allowBlock: 17, absoluteTexture: [21, 21, 22, 21, 21, 21] },
              { allowBlock: 27, absoluteTexture: [36, 36, 5, 36, 36, 36] }, { allowBlock: 42, absoluteTexture: [60, 60, 44, 44, 61, 61] },
              { allowBlock: 31, absoluteTexture: [45, 46, 63, 63, 46, 46] }, { allowBlock: 32, absoluteTexture: [47, 46, 63, 63, 46, 46] },
              { allowBlock: 43, absoluteTexture: [62, 46, 63, 63, 46, 46] }, { allowBlock: 49, absoluteTexture: [69, 69, 67, 69, 69, 69] },
              { allowBlock: 53, absoluteTexture: [78, 78, 79, 78, 78, 78] }, { allowBlock: 56, absoluteTexture: [3, 3, 88, 3, 3, 3] },
              { allowBlock: 63, absoluteTexture: [109, 109, 107, 109, 109, 109] }, { allowBlock: 64, absoluteTexture: [109, 109, 108, 109, 109, 109] },
              { allowBlock: 70, absoluteTexture: [120, 119, 103, 119, 119, 119] }, { allowBlock: 71, absoluteTexture: [121, 119, 103, 119, 119, 119] },
              { allowBlock: 80, absoluteTexture: [137, 137, 138, 137, 137, 137] }, { allowBlock: 89, absoluteTexture: [160, 160, 159, 160, 160, 160] },
              { allowBlock: 104, absoluteTexture: [183, 183, 167, 183, 183, 183] }, { allowBlock: 88, absoluteTexture: [155, 155, 156, 155, 155, 155] },
              { allowBlock: 37, absoluteTexture: [[53, "#9E814D"], [53, "#9E814D"], [53, "#9E814D"], [53, "#9E814D"], [53, "#9E814D"], [53, "#9E814D"]] },
              { allowBlock: 38, absoluteTexture: [[54, "#9E814D"], [54, "#9E814D"], [54, "#9E814D"], [54, "#9E814D"], [54, "#9E814D"], [54, "#9E814D"]] },
              { allowBlock: 78, absoluteTexture: [[133, "#9E814D"], [133, "#9E814D"], [133, "#9E814D"], [133, "#9E814D"], [133, "#9E814D"], [133, "#9E814D"]] },
              { allowBlock: 79, absoluteTexture: [[134, "#9E814D"], [134, "#9E814D"], [134, "#9E814D"], [134, "#9E814D"], [134, "#9E814D"], [134, "#9E814D"]] },
            ]
            let search = arrayTexture.filter((e) => e.allowBlock == allowBlock)[0];
            let t = search.absoluteTexture;
            let mat = [
              new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_${t[0][0] ? t[0][0] : t[0]}`).getAttribute("src")), color: (t[0][0] ? t[0][1] : false), transparent: true
              }),
              new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_${t[1][0] ? t[1][0] : t[1]}`).getAttribute("src")), color: (t[1][0] ? t[1][1] : false), transparent: true
              }),
              new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_${t[2][0] ? t[2][0] : t[2]}`).getAttribute("src")), color: (t[2][0] ? t[2][1] : false), transparent: true
              }),
              new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_${t[3][0] ? t[3][0] : t[3]}`).getAttribute("src")), color: (t[3][0] ? t[3][1] : false), transparent: true
              }),
              new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_${t[4][0] ? t[4][0] : t[4]}`).getAttribute("src")), color: (t[4][0] ? t[4][1] : false), transparent: true
              }),
              new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_${t[5][0] ? t[5][0] : t[5]}`).getAttribute("src")), color: (t[5][0] ? t[5][1] : false), transparent: true
              })
            ];
            return mat;
          }

          document.body.addEventListener("mousedown", (e) => {
            if (e.which == 3) {
              raycaster.setFromCamera(mouse, camera);
              var intersects = raycaster.intersectObjects(scene.children);
              if (intersects[0]) {
                if (Math.abs(camera.position.x - intersects[0].point.x) < 9 && Math.abs(camera.position.z - intersects[0].point.z) < 9 && Math.abs(camera.position.y - intersects[0].point.y) < 9) {
                  let crossObject = [8, 9, 10, 12, 22, 23, 40, 41, 44, 51, 54, 55, 67, 57, 114, 115, 116, 117, 118, 134, 135, 136];
                  let fixTexture = [3, 7, 11, 17, 27, 31, 32, 37, 38, 42, 43, 49, 53, 56, 63, 64, 70, 71, 78, 79, 80, 88, 89, 104];
                  let x = ((Math.abs(intersects[0].point.x) % 1 == 0.5) ? ((Math.abs(camera.position.x) > Math.abs(intersects[0].point.x)) ? (Math.ceil(Math.abs(intersects[0].point.x)) * Math.sign(intersects[0].point.x)) : (Math.floor(Math.abs(intersects[0].point.x)) * Math.sign(intersects[0].point.x))) : Math.round(intersects[0].point.x));
                  let y = ((Math.abs(intersects[0].point.y) % 1 == 0.5) ? ((Math.abs(camera.position.y) > Math.abs(intersects[0].point.y)) ? (Math.ceil(Math.abs(intersects[0].point.y)) * Math.sign(intersects[0].point.y)) : (Math.floor(Math.abs(intersects[0].point.y)) * Math.sign(intersects[0].point.y))) : Math.round(intersects[0].point.y));
                  let z = ((Math.abs(intersects[0].point.z) % 1 == 0.5) ? ((Math.abs(camera.position.z) > Math.abs(intersects[0].point.z)) ? (Math.ceil(Math.abs(intersects[0].point.z)) * Math.sign(intersects[0].point.z)) : (Math.floor(Math.abs(intersects[0].point.z)) * Math.sign(intersects[0].point.z))) : Math.round(intersects[0].point.z));
                  let texture = new THREE.TextureLoader().load(document.getElementsByClassName(`allow_block`)[setblock].getAttribute("src"));
                  let block = undefined, material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
                  if (fixTexture.includes(setblock)) {
                    material = fixTextureFunction(setblock)
                  }
                  if (crossObject.includes(setblock)) {
                    var materials = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
                    block = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                      transparent: true, wireframe: true, color: "#bfb755"
                    }));
                    scene.add(block);
                    localGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
                    mesh1 = new THREE.Mesh(localGeometry, materials);
                    mesh1.rotation.y = THREE.Math.degToRad(45)
                    block.add(mesh1);
                    mesh2 = new THREE.Mesh(localGeometry, materials);
                    mesh1.rotation.y = THREE.Math.degToRad(90)
                    block.add(mesh2);
                    if (intersects[0].object.position.x != x || intersects[0].object.position.y != y || intersects[0].object.position.z != z) {
                      block.position.x = x;
                      block.position.y = y;
                      block.position.z = z;
                      scope++;
                    }
                  } else {
                    block = new THREE.Mesh(geometry, material);
                    if (intersects[0].object.position.x != x || intersects[0].object.position.y != y || intersects[0].object.position.z != z) {
                      block.position.x = x;
                      block.position.y = y;
                      block.position.z = z;
                      scene.add(block);
                      scope++;
                    }
                  }
                }
              }
            }
          }, true);

          (() => {
            let updateInvent = (sign = undefined) => {
              for (i = 1; i < 10; i++) {
                if (setblock + i - 1 < 139) {
                  document.getElementById(`slot${i}`).setAttribute("src", document.getElementsByClassName(`allow_block`)[setblock + i - 1].getAttribute("src"));
                } else {
                  document.getElementById(`slot${i}`).setAttribute("src", "");
                }
              }
            }
            document.addEventListener("wheel", (e) => {
              let sign = Math.sign(e.deltaY || e.detail || e.wheelDelta);
              if (setblock + sign > 0 && setblock + sign < 139) {
                setblock += sign;
                updateInvent(sign)
              }
            });
            updateInvent()
          })()
        })();
        //control keys//

        //chunk generator 
        function generatorChunk(x1 = null, y1 = null, x2 = null, y2 = null, height = null, typeblock = null) {
          let localSaveChank = { x1, y1, x2, y2, height, blocks: [] }
          if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
            for (let i = 0; i < height; i++) {
              let text = new THREE.TextureLoader().load(
                document.getElementById(`gameBlock_18`).getAttribute("src")
              );
              if (i == 1 || i == 2) {
                text = new THREE.TextureLoader().load(
                  document.getElementById(`gameBlock_2`).getAttribute("src")
                );
              }
              if (i == 3) {
                text = new THREE.TextureLoader().load(
                  document.getElementById(`gameBlock_3`).getAttribute("src")
                );
              }
              let mat = new THREE.MeshBasicMaterial({
                map: text,
                transparent: true
              });
              if (i == 4) {
                mat = [
                  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_4`).getAttribute("src")) }),
                  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_4`).getAttribute("src")) }),
                  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_41`).getAttribute("src")), color: "#bfb755" }),
                  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_4`).getAttribute("src")) }),
                  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_4`).getAttribute("src")) }),
                  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(document.getElementById(`gameBlock_4`).getAttribute("src")) })
                ];
              }
              for (let x = x1; x < x2 + 1; x++) {
                for (let y = y1; y < y2 + 1; y++) {
                  let block = new THREE.Mesh(geometry, mat)
                  block.position.x = x
                  block.position.z = y
                  block.position.y = i
                  localSaveChank.blocks.push(block)
                  scene.add(block);
                }
              }
            }
          }
          chanks.push(localSaveChank)
        }
        //chunk generator 

        //default chuncks
        (() => {
          generatorChunk(-16, -16, 0, 0, 5, undefined);
          generatorChunk(-16, 1, 0, 16, 5, undefined);
          generatorChunk(0, -16, 16, 0, 5, undefined);
          generatorChunk(0, 0, 16, 16, 5, undefined);
        })()
        //default chuncks

        //animate function//
        var animate = function () {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }; animate()
        //animate function//
      }
    }, 500);
  });
}

const restartGame = () => {
  document.getElementsByClassName("gameover")[0].style.display = "none";
  document.getElementById("flystatus").innerHTML = `Fly Status: false`;
  for (elem in allInterval) {
    clearInterval(allInterval[elem]);
  }
  allInterval = []
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  NewGame();
}
NewGame();