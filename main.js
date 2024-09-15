const btnStart = document.querySelector("#button_strat")
const board = document.querySelector(".board")
const status = document.querySelector(".status")
const boardDiv = document.querySelector(".boardDiv")
const startAgain = document.querySelector("#startAgain")
const h1 = document.querySelector("#h1")

let matrix = []
const BOX_SIZE = 63
const FREE_CELL = 0
const RABBIT_CELL = 1
const WOLF_CELL = 2
const HOME_CELL = 3
const BAN_CELL = 4

const gameImg = {
	[RABBIT_CELL] : {
		name: "rabbit",
		src: "img/rabbit.png",
	},

	[WOLF_CELL] : {
		name: "wolf",
		src: "img/gamewolf.png",
	},
	[BAN_CELL]:{
		name: "ban",
		src: "img/ban.png",
	},
	[HOME_CELL]:{
		name: "home",
		src: "img/home.png",
	}
}

const settings = {
	wolves : 3,
	bans : 2,
	rabbit : 1,
	home : 1
}

const characterAmount = () => {
	settings.wolves = (getselectValue() * 60) / 100
	settings.bans = (getselectValue() * 40) / 100
}

function  getselectValue(){
	const selectValue = document.querySelector("#play_select").value
	return selectValue
}

const getMatrix = (size) => {
	for(let i = 0; i < size; i++){
		matrix[i] = []
		for(let j = 0; j < size 	; j++){
			matrix[i][j] = FREE_CELL
		}
	}
}

const setRandomCell = () => {
	const x = Math.floor(Math.random() * getselectValue())
	const y = Math.floor(Math.random() * getselectValue())
	if(matrix[y][x] === FREE_CELL){
		return [y,x]
	}else{
		return setRandomCell()
	}
}

const placeCharacter = (character,amount) =>{
	for(let i = 0; i < amount; i++){
		const arr = setRandomCell()
		const [x,y] = [arr[0], arr[1]]
		matrix[x][y] = character
	}
}


const boxSize = () => {
	const boxWidth = getselectValue() * BOX_SIZE
	board.style.width = boxWidth + "px"
}

function createDiv (){
	board.innerHTML = " "
	let boardNumber = 0
	for (let i = 0; i < getselectValue(); i++){
		for(let j = 0; j < getselectValue(); j++){
			const div = document.createElement("div")
			div.id = `cell${boardNumber}`
			board.appendChild(div)
			boardNumber++
			if(matrix[i][j] != FREE_CELL){
				const img = document.createElement("img")
				img.src = gameImg[matrix[i][j]].src
				img.name = gameImg[matrix[i][j]].name
				div.appendChild(img)
			}
		}
	}
}


const characterCoordinate = (character) => {
	const arrXY = []
	let Quantity = 0
	for(let i = 0; i < matrix.length; i++){
		for(let j =0; j < matrix.length; j++){
			if(matrix[i][j] === character){
				arrXY[Quantity] = [i,j]
				Quantity++
			}
		}
	}
	if(arrXY.length === 1){
		return [arrXY[0][0], arrXY[0][1]]
	}
	return arrXY
}

const searchPlaceRabbit = ([y, x]) => {
	if(event.code === "ArrowUp"){
		y -= 1
		if(y === -1){
			y = matrix.length - 1
		}
	}
	if(event.code === "ArrowDown"){
		y += 1
		if(y > matrix.length -1){
			y = 0
		}
	}
	if(event.code === "ArrowLeft"){
		x -= 1
		if(x === -1){
			x = matrix.length - 1
		}
	}
	if(event.code === "ArrowRight"){
		x += 1
		if(x > matrix.length - 1){
			x = 0
		}
	}
	return [x, y]
}

const searchPlaceWolf = ([wolfX,wolfY],[rabbitX, rabbitY]) => {
	const random = Math.floor(Math.random() * 2)
	if(random === 0){
		if(wolfY < rabbitY){
			wolfY +=1
		}
		if(wolfY > rabbitY){
			wolfY -=1
		}
	}else{
		if(wolfX < rabbitX){
			wolfX +=1
		}
		if(wolfX > rabbitX){
			wolfX -=1
		}
	}
	return [wolfY,wolfX]
}

const objectPlace = ([x,y],[yBefore, xBefore],character,characterEqual) => {
	if(matrix[y][x] == FREE_CELL ){
		matrix[yBefore][xBefore] = FREE_CELL
		matrix[y][x] = character
	}
	if(matrix[y][x] === characterEqual){
		boardDiv.style.display = "none"
		status.style.display = "block"
	}
	if(matrix[yBefore][xBefore] === RABBIT_CELL){
		if(matrix[y][x] === HOME_CELL){
			boardDiv.style.display = "none"
			status.style.display = "block"
			h1.innerHTML = "YOU WON"
		}
	}
}

const wolvesMove = () => {
	for(let i = 0; i < characterCoordinate(WOLF_CELL).length; i++){
		const RabbitCoordin = characterCoordinate(RABBIT_CELL)
		const wolvesCoordinate = characterCoordinate(WOLF_CELL)[i]
		const wolvesMove = searchPlaceWolf(wolvesCoordinate,RabbitCoordin)
		objectPlace(wolvesMove,wolvesCoordinate,WOLF_CELL,RABBIT_CELL)
	}

}


const start = () => {
	getMatrix(getselectValue())
	boxSize()
	characterAmount()
	const setRabbit = placeCharacter(RABBIT_CELL, settings.rabbit)
	const setHome = placeCharacter(HOME_CELL, settings.home)
	const setwolvse = placeCharacter(WOLF_CELL, settings.wolves)
	const setBan = placeCharacter(BAN_CELL, settings.bans)
	createDiv()
}

btnStart.addEventListener("click", function(){
	start()
})

document.addEventListener("keyup", function(){	
	const RabbitCoordin = characterCoordinate(RABBIT_CELL)
	const rabbitMove= searchPlaceRabbit(RabbitCoordin,RabbitCoordin)
	objectPlace(rabbitMove,RabbitCoordin,RABBIT_CELL,WOLF_CELL)
	wolvesMove()
	createDiv()
})


startAgain.addEventListener("click", function(){
	boardDiv.style.display = "flex"
	status.style.display = "none"
	h1.innerHTML = "Game Over"
	return start()
})