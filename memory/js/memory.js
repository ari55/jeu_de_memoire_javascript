// Code exécuté au chargement de la page :
document.addEventListener('DOMContentLoaded', function onload () {
    document.removeEventListener('DOMContentLoaded', onload)
    MEMORY.init(document.body)
})

const MEMORY = (function () {
//
// GÉNÉRATEURS DE PAGES
//

    function generateMenu (containerElement) {
        let form = document.createElement('form')
        form.id = 'menu'

        // nom du joueur :
        let div = document.createElement('div')
        let label = document.createElement('label')
        label.setAttribute('for', 'userName')
        label.textContent = 'Nom :'
        let input = document.createElement('input')
        input.type = 'text'
        input.id = 'userName'
        input.maxLength = '10'
        input.value = userName
        div.appendChild(label)
        div.appendChild(input)
        form.appendChild(div)

        // largeur de la grille :
        div = document.createElement('div')
        label = document.createElement('label')
        label.setAttribute('for', 'gridWidth')
        label.textContent = 'Largeur de grille :'
        input = document.createElement('input')
        input.type = 'number'
        input.id = 'gridWidth'
        input.min = '1'
        input.value = gridWidth
        div.appendChild(label)
        div.appendChild(input)
        form.appendChild(div)

        // hauteur de la grille :
        div = document.createElement('div')
        label = document.createElement('label')
        label.setAttribute('for', 'gridHeight')
        label.textContent = 'Hauteur de grille :'
        input = document.createElement('input')
        input.type = 'number'
        input.id = 'gridHeight'
        input.min = '1'
        input.value = gridHeight
        div.appendChild(label)
        div.appendChild(input)
        form.appendChild(div)

        // output : validation dimensions grille :
        div = document.createElement('div')
        label = document.createElement('label')
        label.id = 'output'
        div.appendChild(label)
        form.appendChild(div)

        // radio buttons types de cartes : chiffres, formes géométriques, GOT :
        div = form.appendChild(document.createElement('div'))
        label = document.createElement('label')
        label.textContent = 'Type de cartes :'
        div.appendChild(label)

        div = div.appendChild(document.createElement('div'))
        input = document.createElement('input')
        input.type = 'radio'
        input.name = 'typeCartes'
        input.id = 'chiffres'
        input.value = 'chiffres'
        input.checked = (typeCarte === input.value)
        label = document.createElement('label')
        label.setAttribute('for', 'chiffres')
        label.textContent = 'Chiffres'
        div.appendChild(input)
        div.appendChild(label)

        input = document.createElement('input')
        input.type = 'radio'
        input.name = 'typeCartes'
        input.id = 'formes'
        input.value = 'formes'
        input.checked = (typeCarte === input.value)
        label = document.createElement('label')
        label.setAttribute('for', 'formes')
        label.textContent = 'Formes'
        div.appendChild(input)
        div.appendChild(label)

        input = document.createElement('input')
        input.type = 'radio'
        input.name = 'typeCartes'
        input.id = 'got'
        input.value = 'got'
        input.checked = (typeCarte === input.value)
        label = document.createElement('label')
        label.setAttribute('for', 'got')
        label.textContent = 'Game of Thrones'
        div.appendChild(input)
        div.appendChild(label)

        // bouton Play :
        input = document.createElement('button')
        input.id = 'playButton'
        input.textContent = 'Jouer'
        form.appendChild(input)
        form.addEventListener('input', checkInput)
        form.addEventListener('submit', playButtonClicked)

        containerElement.appendChild(form)

        // tableau de scores :
        form = document.createElement('table')
        form.id = 'scoreBoard'
        div = document.createElement('caption')
        div.textContent = 'scores :'
        form.appendChild(div)
        div = document.createElement('tr')
        label = document.createElement('th')
        label.textContent = 'joueur'
        div.appendChild(label)
        label = document.createElement('th')
        label.textContent = 'score'
        div.appendChild(label)
        label = document.createElement('th')
        label.textContent = 'temps'
        div.appendChild(label)
        form.appendChild(div)
        for (input of scoreBoard) {
            div = document.createElement('tr')
            label = document.createElement('td')
            label.textContent = input.name
            div.appendChild(label)
            label = document.createElement('td')
            label.textContent = input.score
            div.appendChild(label)
            label = document.createElement('td')
            label.textContent = input.time
            div.appendChild(label)
            form.appendChild(div)
        }
        containerElement.appendChild(form)
    }

    function generateBoard (containerElement, width, height, imgFolder) {
        // générer le plateau de jeu :
        let board = document.createElement('div')
        board.id = 'board'
        // générer les cartes sur le plateau :
        let card
        let img
        const cardNumbers = fillArrayWithRandomPairs(width * height)
        for (let i = 0; i < width * height; i++) {
            card = document.createElement('div')
            card.className = 'card'
            card.addEventListener('click', flipCard)

            img = document.createElement('img')
            img.src = 'images/' + imgFolder + '/' + cardNumbers[i] + '.jpg'
            img.alt = cardNumbers[i]
            // img.hidden = true // TEST
            card.appendChild(img)

            board.appendChild(card)
        }
        containerElement.appendChild(board)

        // créer la grille en css :
        let cssVal = ''
        for (let i = 0; i < width; i++) {
            cssVal += 'auto '
        }
        board.style.gridTemplateColumns = cssVal

        // score, temps, boutons, ... :
        board = document.createElement('div')
        board.id = 'dashboard'
        board.addEventListener('click', dashboardButtonClicked)

        img = document.createElement('label')
        img.id = 'score'
        img.textContent = 'score : 0'
        board.appendChild(img)
        img = document.createElement('label')
        img.id = 'time'
        img.textContent = 'Temps : 0'
        board.appendChild(img)
        card = document.createElement('button')
        card.textContent = 'Rejouer'
        board.appendChild(card)
        card = document.createElement('button')
        card.textContent = 'Menu'
        board.appendChild(card)
        img = document.createElement('label')
        img.id = 'output'
        board.appendChild(img)

        containerElement.appendChild(board)
        hideAllCards(500) // TEST
        timer()
    }

    //
    //
    //

    function hideAllCards (delay) {
        // retourne toutes les cartes au bout d'un certain délai
        setTimeout(function () {
            for (const img of document.getElementsByClassName('card')) {
                img.classList.add('facedown')
            }
        }, delay)
    }

    let time = 0
    let timerID
    function timer () {
        document.getElementById('time').textContent = 'Temps : ' + ++time
        timerID = setTimeout(timer, 1000)
        if (time % 20 === 0 && score > 0) {
            score--
            document.getElementById('score').textContent = 'score : ' + score
        }
    }

    //
    // EVENTS
    //

    function checkInput (event) {
        if (event.target.id === 'gridWidth' || event.target.id === 'gridHeight') {
            const gridWidth = document.getElementById('gridWidth').value
            const gridHeight = document.getElementById('gridHeight').value
            const output = document.getElementById('output')
            const playButton = document.getElementById('playButton')
            playButton.disabled = true
            if ((gridWidth * gridHeight) % 2 !== 0) {
                output.textContent = 'Au moins une dimension de la grille doit être de valeur paire'
            } else if (gridWidth * gridHeight / 2 > 20) {
                output.textContent = 'Pour l\'instant, on ne peut pas avoir plus de 20 paires de cartes dans le jeu'
            } else {
                playButton.disabled = false
                output.textContent = ''
            }
        }
    }

    let userName = ''
    let gridWidth = 5
    let gridHeight = 4
    let typeCarte = 'chiffres'
    function playButtonClicked (event) {
        event.preventDefault()
        userName = document.getElementById('userName').value
        gridWidth = document.getElementById('gridWidth').value
        gridHeight = document.getElementById('gridHeight').value

        /* for (const node of document.getElementsByName('typeCartes')) {
        if (node.checked) {
            typeCarte = node.value
        }
    } */
        const typesCartes = document.getElementsByName('typeCartes')
        let i = 0
        while (i < typesCartes.length && !typesCartes[i].checked) {
            i++
        }
        typeCarte = typesCartes[i].value

        document.getElementById('menu').remove()
        document.getElementById('scoreBoard').remove()
        generateBoard(document.body, gridWidth, gridHeight, typeCarte)
    }

    const scoreBoard = []
    let prevCard
    let score = 0
    let foundPairs = 0
    function flipCard (event) {
    // Déclenché lorsqu'on clique sur une carte
        event.currentTarget.removeEventListener('click', flipCard)
        event.currentTarget.classList.remove('facedown')
        if (prevCard != null) {
            // c'est la deuxième carte qu'on retourne
            if (event.currentTarget.children[0].src === prevCard.children[0].src) {
                // on a trouvé une paire
                prevCard = null
                score += 2
                foundPairs++
                if (foundPairs > gridHeight * gridWidth / 2 - 1) {
                    // on a gagné la partie
                    clearTimeout(timerID)
                    document.getElementById('output').textContent = 'Bravo ! Vous avez obtenu ' + score + ' points en ' + time + ' secondes'
                    scoreBoard.push({ name: userName, score: score, time: time })
                    scoreBoard.sort(function (a, b) {
                        return (b.score - a.score !== 0 ? b.score - a.score : a.time - b.time)
                    })
                }
            } else {
                // les deux cartes retournées sont différentes
                event.currentTarget.addEventListener('click', flipCard)
                prevCard.addEventListener('click', flipCard)
                const currCard = event.currentTarget
                setTimeout(function () {
                    currCard.classList.add('facedown')
                    prevCard.classList.add('facedown')
                    prevCard = null
                }, 500)
                score--
            }
            document.getElementById('score').textContent = 'score : ' + score
        } else {
            // c'est la première carte qu'on retourne
            prevCard = event.currentTarget
        }
    }

    function dashboardButtonClicked (event) {
        switch (event.target.textContent) {
        case 'Rejouer':
            score = 0
            foundPairs = 0
            time = 0
            clearTimeout(timerID)
            document.getElementById('board').remove()
            document.getElementById('dashboard').remove()
            generateBoard(document.body, gridWidth, gridHeight, typeCarte)
            break
        case 'Menu':
            score = 0
            foundPairs = 0
            time = 0
            clearTimeout(timerID)
            document.getElementById('board').remove()
            document.getElementById('dashboard').remove()
            generateMenu(document.body)
            break
        default:break
        }
    }

    //
    // UTILITAIRES
    //

    function getRandomNumber (min, max) {
    // Retourne un entier aléatoire entre min et max compris
        return Math.floor(min + Math.random() * (max + 1 - min))
    }

    function fillArrayWithRandomPairs (length) {
    // Retourne un tableau de longueur length avec des nombres entiers aléatoires compris entre 0 et length/2, tous présents deux fois
        const array = new Array(length)
        let nb
        for (let i = 0; i < length; i++) {
            do {
                nb = getRandomNumber(0, length / 2 - 1)
            } while (array.filter(function (value) {
                return value === nb
            }).length > 1)
            array[i] = nb
        }
        return array
    }
    return { init: generateMenu }
})()
