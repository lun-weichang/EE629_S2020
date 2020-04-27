import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";

const pokemonIDCol = 6;
const itemsPerPage = 20;

class MachinesList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            pageNotFound: false,
            machineData: undefined,
            currentPageNum: undefined,
            totalNumberOfPages: undefined
        };
    }


    async getMachines(currentPageNum) {
        if (currentPageNum && currentPageNum < 0) {
            this.setState({pageNotFound: true});
            return;
        }
        let totalNumberOfPages;
        let maxNum;
        let offset = (currentPageNum && currentPageNum > 0) ? currentPageNum * itemsPerPage : 0;
        try {
            let poke_url = "https://pokeapi.co/api/v2/machine/?offset=" + offset + "&limit=" + itemsPerPage;

            const machinesList = await axios.get(poke_url);
            maxNum = Math.ceil(machinesList.data.count / itemsPerPage);
            if (maxNum === currentPageNum && currentPageNum === 0) {
                totalNumberOfPages = 0;
            } else if ((maxNum - 3) >= currentPageNum) {
                totalNumberOfPages = 3;
            } else if (maxNum > currentPageNum && (maxNum - 3) <= currentPageNum) {
                totalNumberOfPages = maxNum - currentPageNum;
            } else {
                this.setState({pageNotFound: true});
                totalNumberOfPages = -1;
                return;
            }
            console.log(`maxNum = ${maxNum}, currentPageNum = ${currentPageNum}, totalNumberOfPages = ${totalNumberOfPages}`);
            this.setState({ machineData: machinesList.data, currentPageNum: currentPageNum, totalNumberOfPages: totalNumberOfPages});
        } catch (err) {
            console.log(err);
        }
    }

    //prevents the page from reloading when changing page
    componentWillReceiveProps(props) {
        this.getMachines(Number(props.match.params.page));
    }

    //triggered when page number is added manually to the URL
    componentDidMount() {
        this.getMachines(Number(this.props.match.params.page));
    }

    render() {
        let li_tag = null;
        let html_body = null;
        let nextPage = null;
        let previousPage = null;
        console.log(`this.state.pageNotFound = ${this.state.pageNotFound}`);
        if (!this.state.pageNotFound) {
            if (this.state.currentPageNum >= 0 && this.state.totalNumberOfPages >= 0) {
                let ref;
                if (1 < this.state.totalNumberOfPages) {
                    ref = `/machines/page/${Number(this.state.currentPageNum) + 1}`;
                    nextPage = <li><Link to={ref}>Next Page</Link></li>
                }
                if (1 <= this.state.currentPageNum) {
                    ref = `/machines/page/${Number(this.state.currentPageNum) - 1}`;
                    previousPage = <li><Link to={ref}>Previous Page</Link></li>
                }
            }
            //lists out each machine
            li_tag = this.state.machineData && this.state.machineData.results.map((machine) => (
                <li key={machine.url.split("/")[pokemonIDCol]} className="cap-first-letter">
                    <Link to={`/machines/${machine.url.split("/")[pokemonIDCol]}`}>ID: {machine.url.split("/")[pokemonIDCol]}</Link>
                </li>
            ));

            html_body = (
                <div>
                    <nav>
                        <ul className="pagination_tag">
                            {previousPage}
                            {nextPage}
                        </ul>
                    </nav>
                    <ul className="list-unstyled">{li_tag}</ul>
                </div>
            )
        } else {
            html_body = (
                <div>
                    <Redirect to="/nonexist" status={404}/>
                </div>
            )
        }
        
        return html_body;
    }
}

export default MachinesList;