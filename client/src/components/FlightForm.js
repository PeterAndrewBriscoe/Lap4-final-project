import React, {useState} from 'react';
import axios from 'axios';
import HotelFinder from './HotelFinder';

const FlightForm = (props) => {
    const [origins, setOrigins] = useState([])
    const [destinations, setDestinations] = useState([])

    const [adults, setAdults] = useState()
    const [children, setChildren] = useState()
    //const [outDate, setOutDate] = useState()
    //const [returnDate, setReturnDate] = useState()
    
    const [destinationCode, setDestinationCode]= useState()
    const [originCode, setOriginCode]= useState()//props.flighForm.origin)

    const [url, setUrl]=useState()
    const [searches, setSearches]=useState(0)

    async function getAirports(e){
        setSearches(searches+1)
        setOriginCode(null)
        setDestinationCode(null)
        setUrl(null)
        e.preventDefault()
        
        const body = {'destination': props.destination, 'origin': e.target[0].value }
        const results = await axios.post("https://globe--trotter.herokuapp.com/airports/", body)

        const potential_destinations = []
        const potential_origins = []

        for(let x in results.data.origin){
            potential_origins.push(results.data.origin[x])
        }
        setOrigins(potential_origins)

        for(let x in results.data.destination){
            potential_destinations.push(results.data.destination[x])
        }
        setDestinations(potential_destinations)

        if(potential_origins.length > 1){
            setOriginCode(potential_origins[0].code)
        } else if (potential_origins.length === 0){
            setOriginCode(null)
        }

        if(potential_destinations.length === 1){
            setDestinationCode(potential_destinations[0].code)
        } else if (potential_destinations.length === 0){
            setDestinationCode(null)
        }

        let parsedOutDate = props.dates[0].toISOString()
        parsedOutDate = parsedOutDate.substring(2, 10).replace(/-/g, '')
        let parsedRtnDate = props.dates[1].toISOString()
        parsedRtnDate = parsedRtnDate.substring(2, 10).replace(/-/g, '')

        setAdults(e.target[1].value)
        setChildren(e.target[2].value)
        props.flightForm.setFlightForm({
            origin: parseInt(e.target[0].value),
			adults: parseInt(e.target[2].value),
			children: children
        })

        //format date correctly ready for URL
        /*let formattedOutDate = e.target[1].value.substring(2).replace(/-/g,'')
        let formattedReturnDate = e.target[2].value.substring(2).replace(/-/g,'')
        setOutDate(formattedOutDate)
        setReturnDate(formattedReturnDate)*/
        
        
        if(originCode && destinationCode){
            const url = `https://www.skyscanner.net/transport/flights/${originCode}/${destinationCode}/${parsedOutDate}/${parsedRtnDate}?adults=${adults}&adultsv2=1&cabinclass=economy&children=${children}&childrenv2=&inboundaltsenabled=false&infants=0&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1`
            setUrl(url)
        }
    }
    

    function generateLink(e){
        // "https://www.skyscanner.net/transport/flights/lond/nyca/220209/220216/"
        // "?adults=1&adultsv2=1&cabinclass=economy&children=0&childrenv2="
        // "&inboundaltsenabled=false&infants=0&outboundaltsenabled=false"
        // "&preferdirects=false&ref=home&rtn=1"
        e.preventDefault()
        if(e.target.name === "origin-list"){
            setOriginCode(e.target.value)
        }
        else if(e.target.name === "destination-list"){
            setDestinationCode(e.target.value)
        }

        if(originCode && destinationCode){
            let parsedOutDate = props.dates[0].toISOString()
            parsedOutDate = parsedOutDate.substring(2, 10).replace(/-/g, '')
            let parsedRtnDate = props.dates[1].toISOString()
            parsedRtnDate = parsedRtnDate.substring(2, 10).replace(/-/g, '')
            const url = `https://www.skyscanner.net/transport/flights/${originCode}/${destinationCode}/${parsedOutDate}/${parsedRtnDate}?adults=${adults}&adultsv2=1&cabinclass=economy&children=${children}&childrenv2=&inboundaltsenabled=false&infants=0&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1`
            setUrl(url)
        }
        }

    return(
        <>
        <div className="flex-container">
        <form id="flight-form" onSubmit={getAirports}>
            <>
                <label>Flight from:</label>
                <input required name="from" type="text"/>
            </>
            <>
                <label>Number of Adults:</label>
                <input required name="adults" type="number" min="0" max="8" />
            </>
            <>
                <label>Number of Children:</label>
                <input name="children" type="number" min="0" max="8" />
            </>
            <input type="submit" disabled={!props.dates}/>
        </form>
        {origins.length > 0 && destinations.length > 0 ? <form className="potential-airports">
                                            <select name="origin-list" onChange={generateLink}>
                                                <option value="">Select Airport</option>
                                                {origins.map( x => <option value={x.code} key={x.code}>{x.name}</option>)}
                                            </select>
                                </form>
        : <></>}
        {destinations.length > 0 && origins.length > 0 ? <form className="potential-airports">
                                            <select name="destination-list" onChange={generateLink}>
                                                {destinations.map( x => <option value={x.code} key={x.code}>{x.name}</option>)}
                                            </select>
                                        </form>
        : <></>}
        {searches > 0 && (destinations.length === 0 || origins.length === 0) ? <p>Currently no flights to one or more of these airports</p> : <> </>}
        {url && (destinations.length !== 0 && origins.length !== 0) ? <a href={url} target="_blank" rel="noopener noreferrer">Click Here For Flights!</a> : <> </>}
        </div>
        {/* <HotelFinder props....../> */}
        </>
    )
}


    //<label>Outbound Date:</label>
    //<input required name="outboundDate" type="date"/>
    //<label>Return Date:</label>
    //<input required name="returnDate" type="date"/>
export default FlightForm