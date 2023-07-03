const API_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search?format=json&limit=3';
const API_URL_FAVORITES = 'https://api.thedogapi.com/v1/favourites';
const API_URL_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}`;
const API_KEY = 'live_HufZeB9JjioTfoZzC1oRPchgmXCbEeCv7pYUEQneTPdPQbsjK7GG8jP6bBh3Q1dI';
const API_URL_UPLOAD = 'https://api.thedogapi.com/v1/images/upload';


const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
    }
}


const spanError = document.getElementById('error');

async function getRandomDog() {
    const res = await fetch(API_URL_RANDOM, options);
    const data = await res.json();
    console.log('RANDOM DATA');
    console.log(data);
    if (res.status !== 200) {
        spanError.innerHTML = `There was an error: ${res.status} ${res.data.message}`
    } else {
        const div = document.querySelector('.random-dog-images');
        div.innerHTML = "";
        data.forEach((dog) =>{
            const article = document.createElement('article');
            const img = document.createElement('img');
            const button = document.createElement('button');
            img.src = dog.url;
            img.className = 'image-dog';
            button.textContent = 'Add to favorites'
            button.addEventListener('click', () => {
                saveFavoriteDog(dog.id);
                //article.remove();
            })
            article.append(img, button);
            div.append(article);
        })

    }
}

const reloadButton = document.querySelector('#reload-button');
reloadButton.addEventListener('click', getRandomDog);

async function getFavoriteDogs() {
    const res = await fetch(API_URL_FAVORITES, options);
    const data = await res.json();
    if (res.status !== 200) {
        spanError.innerHTML = `There was an error: ${res.status} ${data.message}`;
    } else {
        const toRender = [];
        const div = document.querySelector('.favorites-dogs-images')
        div.innerHTML = "";
        data.forEach(dog => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            img.className = 'image-dog-favorites';
            const btn = document.createElement('button');
            btn.textContent = 'Delete of favorites';
            btn.className = 'button-delete'
            //const textBtn = document.createTextNode('Delete of favorites')
            //btn.append(textBtn)
            btn.onclick = () => deleteFavoriteDog(dog.id)
            img.src = dog.image.url;

            article.append(img, btn);
            toRender.push(article)
        })

        div.append(...toRender)

    }
    console.log('Favorites');
    console.log(data);
}

async function saveFavoriteDog(id) {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        },
        body: JSON.stringify({
            image_id: id,
        })
    });
    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = `There was an error: ${res.status} ${data.message}`;
    } else {
        console.log('Dog saved in favorites');
    }
    console.log('POST');
    console.log(data);
    getFavoriteDogs();
}

async function deleteFavoriteDog(id) {
    const res = await fetch(API_URL_DELETE(id), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        }
    });
    const data = await res.json();
    if (res.status !== 200) {
        spanError.innerHTML = `There was an error: ${res.status} ${data.message}`;
    } else {
        console.log('Dog deleted of favorites');
        getFavoriteDogs();
    }
}

async function uploadDogPhoto() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/form-data',
            'x-api-key': API_KEY
        },
        body: formData
    });
    const data = await res.json();

/*     const input = document.getElementById('file');
    const label = document.querySelector('label');

    input.addEventListener("change", () => {
        const preview = document.createElement('img');
        console.log(preview);
        const img = label.querySelector('img');
        if (img) img.remove();

        if (input.files[0]) {
            preview.src = URL.createObjectURL(input.files[0]);
            label.append(preview);
        }
    })
 */
    if (res.status !== 201) {
        spanError.innerHTML = `There was an error: ${res.status} ${data.message}`;
    } else {
        console.log('Photo of dog uploaded :)');
        console.log({ data });
        console.log(data.url);

        saveFavoriteDog(data.id);
    }
}

const btnUpload = document.getElementById('button-upload');
btnUpload.addEventListener('click', uploadDogPhoto)

function preview() {
    const form = document.getElementById('uploadingForm')
    const label = document.querySelector('label');

    const formData = new FormData(form)
	//usamos el FileReader para sacar la información del archivo del formData
    const reader = new FileReader();

//Este código es para borrar la miniatura anterior al actualizar el form.
    if (label.children.length > 1) {
        const preview = document.getElementById("previewImage")
        label.removeChild(preview)
    }
//aquí sucede la magia, el reader lee los datos del form.
    reader.readAsDataURL(formData.get('file'))

//Éste código es para cuando termine de leer la info de la form, cree una imagen miniatura de lo que leyó el form.
    reader.onload = () => {
        const previewImage = document.createElement('img')
        previewImage.id = "previewImage"
        previewImage.width = 250;
        previewImage.src = reader.result
        label.appendChild(previewImage);
    }
}

const input = document.getElementById('file');
input.addEventListener('change', preview)


getRandomDog();
getFavoriteDogs();

/* async function getImg() {
    try {
        const data = await fetchData(URL);
        const image = data[0].url;
        const img = document.querySelector('img');
        img.src = image;
    } catch (err) {
        console.error(err);
    }
} */

/* const buttonFavorite = document.getElementsByClassName('save-favorite');
const buttonSaveFavorite = [...buttonFavorite];
buttonSaveFavorite.forEach(button => {
    button.addEventListener('click', saveFavoriteDog)
}) */

//anotherImgButton.onclick = getImg;
