export function classProcess(type, id, classname, removeall = false) {
  let elemt;
  if (type == "class") {
    elemt = document.querySelector(`.${id}`);
  } else {
    elemt = document.querySelector(`#${id}`);
  }
  if (elemt.classList.contains(classname[0])) {
    if (removeall) {
      elemt.className = "";
    }
    elemt.classList.remove(classname[0]);
  } else {
    for (let i of classname) {
      elemt.classList.add(i);
    }
  }
}
export function classProcessReplace(type, id, classInit, classReem) {
  console.log(classInit);
  console.log(classReem);
  // let elemt;
  // if (type == "class") {
  //   elemt = document.querySelector(`.${id}`);
  // } else {
  //   elemt = document.querySelector(`#${id}`);
  // }
  // if (elemt.classList.contains(classInit)) {
  //   elemt.classList.remove(classInit);
  //   elemt.classList.add(classReem);
  // } else {
  //   elemt.classList.remove(classReem);
  //   elemt.classList.add(classInit);
  // }
}
