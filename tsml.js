//retrive json meeting feed
const getData = async (url) => {
    return new Promise(async(resolve, reject) => {
        const data = await fetch(url);
        const parsedData = await data.json();
        resolve(parsedData);
        return;
    })
}

//format address for google map iframe
//using promise to stop flickering, without it changes the url mid load
const formatAddress = (address) => {
    return new Promise((resolve, reject) => {
        const arr = address.split(' ');
        var del = -1;
        arr.forEach((string, index) => {
            if (string.startsWith('#')) {
                console.log(index)
                del = index;
            }
        })
        if (del !== -1) {
            arr.splice(del, 1);
        }
        console.log(arr.join('+'))
        resolve(arr.join('+'));
    })
}

//show additional information on each row
// "lazy load" google maps iframe
const expandMeeting = async (e) => {
    const parent = e.target.parentNode;
    const secondRow = parent.parentNode.querySelector('.second-row');
    //Add map to row using Google Maps embed api
    if (secondRow.map !== "true") {
        const mapContainer = document.createElement('div');
        mapContainer.className = 'map-container';
        const address = parent.querySelector('.address').innerHTML;
        const formattedAddress = await formatAddress(address);
        const map = document.createElement('iframe');
        Object.assign(map, {className: 'map', width: '100%', height: '100%', src: `https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=${formattedAddress}&t=&z=14&ie=UTF8&iwloc=B&output=embed`})
        mapContainer.append(map);
        secondRow.append(mapContainer);
        secondRow.map = "true";
    }
    if (e.target.innerHTML === "More Info") {
        secondRow.style.display = 'flex';
        e.target.innerHTML = "Collapse"
        return;
    }
    if (e.target.innerHTML === "Collapse") {
        secondRow.style.display = 'none';
        e.target.innerHTML = "More Info"
        return;
    }
}

const convertDay = (day) => {
    switch(day) {
        case 0:
            return "Sunday"
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6:
            return "Saturday"
    }
}

const meetingTypes = (arr) => {
    const converted = [];
    arr.forEach((type) => {
        switch(type) {
            case '11':
                return converted.push('11th Step Meditation')
            case '12x12':
                return converted.push('12 Steps & 12 Traditions')
            case 'ASL':
                return converted.push('American Sign Language')
            case 'ABSI':
                return converted.push('As Bill Sees It')
            case 'BA':	
                return converted.push('Babysitting Available')
            case 'B':	
                return converted.push('Big Book')
            case 'H':	
                return converted.push('Birthday')
            case 'BI':	
                return converted.push('Bisexual')
            case 'BRK':	
                return converted.push('Breakfast')
            case 'CAN':	
                return converted.push('Candlelight')
            case 'CF':	
                return converted.push('Child-Friendly')
            case 'C':	
                return converted.push('Closed')
            case 'AL-AN':	
                return converted.push('Concurrent with Al-Anon')
            case 'AL':	
                return converted.push('Concurrent with Alateen')
            case 'XT':	
                return converted.push('Cross Talk Permitted')
            case 'DR':	
                return converted.push('Daily Reflections')
            case 'DB':	
                return converted.push('Digital Basket')
            case 'D':	
                return converted.push('Discussion')
            case 'DD':	
                return converted.push('Dual Diagnosis')
            case 'EN':	
                return converted.push('English')
            case 'FF':	
                return converted.push('Fragrance Free')
            case 'FR':	
                return converted.push('French')
            case 'G':	
                return converted.push('Gay')
            case 'GR':	
                return converted.push('Grapevine')
            case 'HE':	
                return converted.push('Hebrew')
            case 'NDG':	
                return converted.push('Indigenous')
            case 'ITA':	
                return converted.push('Italian')
            case 'JA':	
                return converted.push('Japanese')
            case 'KOR':	
                return converted.push('Korean')
            case 'L':	
                return converted.push('Lesbian')
            case 'LIT':	
                return converted.push('Literature')
            case 'LS':	
                return converted.push('Living Sober')
            case 'LGBTQ':	
                return converted.push('LGBTQ')
            case 'TC':	
                return converted.push('Location Temporarily Closed')
            case 'MED':	
                return converted.push('Meditation')
            case 'M':	
                return converted.push('Men')
            case 'N':	
                return converted.push('Native American')
            case 'BE':	
                return converted.push('Newcomer')
            case 'NS':	
                return converted.push('Non-Smoking')
            case 'ONL':	
                    return converted.push('Online')
            case 'O':	
                return converted.push('Open')
            case 'OUT':	
                return converted.push('Outdoor')
            case 'POC':	
                return converted.push('People of Color')
            case 'POL':	
                return converted.push('Polish')
            case 'POR':	
                return converted.push('Portuguese')
            case 'P':	
                return converted.push('Professionals')
            case 'PUN':	
                return converted.push('Punjabi')
            case 'RUS':	
                return converted.push('Russian')
            case 'A':	
                return converted.push('Secular')
            case 'SEN':	
                return converted.push('Seniors')
            case 'SM':	
                return converted.push('Smoking Permitted')
            case 'S':	
                return converted.push('Spanish')
            case 'SP':	
                return converted.push('Speaker')
            case 'ST':	
                return converted.push('Step Study')
            case 'TR':	
                return converted.push('Tradition Study')
            case 'T':	
                return converted.push('Transgender')
            case 'X':	
                return converted.push('Wheelchair Access')
            case 'XB':	
                return converted.push('Wheelchair-Accessible Bathroom')
            case 'W':	
                return converted.push('Women')
            case 'Y':	
                return converted.push('Young People')
        }
    });
    return converted;
}


const tsml = document.getElementById('tsml');
const dataSource = tsml.getAttribute("src");


const displayData = (meetings) => {
    console.log(meetings[0]);
    var maxWidth = 0;
    meetings.forEach((meeting, index) => {
        const rowContainer = document.createElement("div");
        if (index % 2 === 0) {
            rowContainer.className = "row-container dark"
        } else {
            rowContainer.className = "row-container light"
        }
        const row = document.createElement("div");
        row.className = "tsml-row"
        const time = document.createElement("span");
        time.className = "time";
        const day = document.createElement("span");
        day.className = "day";
        const name = document.createElement("span");
        name.className = "name";
        const group = document.createElement("span");
        group.className = "group";
        const address = document.createElement("span");
        address.className = "address";
        const btn = document.createElement('button');
        btn.className = "more-info"
        btn.innerHTML = "More Info";
        btn.onclick = expandMeeting;
        time.innerHTML = meeting.time;
        day.innerHTML = convertDay(meeting.day);
        name.innerHTML = meeting.name;
        group.innerHTML = meeting.group ? meeting.group: null;
        address.innerHTML = meeting.formatted_address;
        row.append(time);
        row.append(day);
        row.append(name);
        row.append(group);
        row.append(address);
        row.append(btn);
        rowContainer.append(row);
        const secondRow = document.createElement('div');
        secondRow.className = 'second-row';
        if (meeting.notes) {
            const notesContainer = document.createElement('div');
            notesContainer.className = 'notes-container';
            notesContainer.innerHTML= `<b>Notes:</b>${meeting.notes}`
            secondRow.append(notesContainer);
        }
        if (meeting.conference_url) {
            const confUrlContainer = document.createElement('a');
            confUrlContainer.href = meeting.conference_url;
            confUrlContainer.className = 'url-container';
            confUrlContainer.innerHTML= `<b>Url:</b> ${meeting.conference_url}`
            secondRow.append(confUrlContainer);
        }
        if (meeting.types) {
            const typesRow = document.createElement('div');
            typesRow.className = 'types-row';
            const converted = meetingTypes(meeting.types);
            converted.forEach((type) => {
                const typeContainer = document.createElement('div');
                typeContainer.className = 'type'
                typeContainer.innerHTML = type;
                typesRow.append(typeContainer);
            })
            rowContainer.append(typesRow);
        }
        rowContainer.append(secondRow);
        tsml.append(rowContainer);
    });
}

const tsmlCss = document.createElement('link');
tsmlCss.setAttribute('href', "tsml.css");
tsmlCss.setAttribute('rel', "stylesheet");
document.getElementsByTagName("head")[0].append(tsmlCss);

getData(dataSource).then((val) => {
    displayData(val);
})

