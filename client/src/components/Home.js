import React, { Component } from "react";
import "./styles/Home.css"
import history from "../helpers/history"
import { Navbar,Nav,NavDropdown,Form,FormControl,Button,Col, Card } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from 'sweetalert';
import axios from 'axios' ;
import TimePicker from 'react-time-picker';
import GoogleLogin from 'react-google-login';
class Welcome extends Component {
    constructor() {
        super();
        this.state = {startDate: new Date(),
        place:[{"id":0,"name":"Chennai","distance":333},
            {"id":1,"name":"Hyderabad","distance":569},
            {"id":2,"name":"Goa","distance":580},
            {"id":3,"name":"Manglore","distance":352},
            {"id":4,"name":"Kochi","distance":551}],
        from:"",
        to:"",
        page:1,
            drivers:[{"id":0,"name":"John","age":28,"rate":15,"language":"Malayalam"},
                {"id":1,"name":"Dijo","age":32,"rate":16,"language":"Tamil"},
                {"id":2,"name":"Samson","age":44,"rate":13,"language":"Kannada"},
                {"id":3,"name":"Ashik","age":26,"rate":11,"language":"Tamil"},
                {"id":4,"name":"Ranveer","age":30,"rate":16,"language":"Kannada"}],
            filters:'',
            driversList : [],
            time:'10:00',
            amt:0,

        };
    }
    onChange = time => this.setState({ time })
    handleChange = date => {
        this.setState({
            startDate: date
        });
    };
    componentDidMount() {
        this.setState({
            driversList : this.state.drivers
        })
    }
    numberFormat = (number) =>{
        return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
    }
    formSubmit = async () =>{
        if(this.state.from == ""){
            swal("Oops!","Please Select Pickup Point","error")
        }else if(this.state.to == ""){
            swal("Oops!","Please Select Dropping Point","error")
        }else{
            let data = await axios.get(window.location.protocol + '//' + window.location.host + ':4000/read');
            console.log(data.data)
            if(data.data){
                this.setState({page:2,drivers:data.data,driversList:data.data})
            }
        }
    }
    total = (rate)=>{
        let selected = this.state.place.filter(data => data.id == this.state.to)
        return parseInt(rate*selected[0].distance)
    }
    logout = () =>{
        localStorage.clear();
        this.setState({page:1})
    }
    profile = () =>{
        if(localStorage.getItem('icuser')){

            let profile = JSON.parse(localStorage.getItem('icuser'))
            return(
                <div className="home" style={{width:"90%"}}>
                    <div class="text-right mb-3">
                        <a href="#" class="btn btn-danger" onClick={this.logout} >Logout</a>
                    </div>
                   <h1 align="center">Hai , {profile.name}</h1>
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={profile.email}/>
                            </Form.Group>


                        </Form.Row>

                        <Form.Group controlId="formGridAddress1">
                            <Form.Label>Address</Form.Label>
                            <Form.Control placeholder="1234 Main St" />
                        </Form.Group>

                        <Form.Group controlId="formGridAddress2">
                            <Form.Label>Address 2</Form.Label>
                            <Form.Control placeholder="Apartment, studio, or floor" />
                        </Form.Group>

                        <Form.Row>
                            <Form.Label style={{paddingTop:'10px',marginLeft:"50px"}}> Pickup Time</Form.Label>
                            <TimePicker
                                onChange={this.onChange}
                                value={this.state.time}
                            />
                        </Form.Row>
                        <br></br>

                        <Button variant="primary" type="submit" onClick={()=>this.setState({page:4})}>
                            Pay {this.numberFormat(this.state.amt)} /-
                        </Button>
                    </Form>
                </div>
            )
        }else{
            return( <GoogleLogin
                clientId="41842724806-ljqhugqns90nsu5ms9da8srku52rimjr.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={()=>{swal("Oops!","Please Select Pickup Point","error")}}
                cookiePolicy={'single_host_origin'}
            />)
        }

    }
    responseGoogle = (response) => {
        console.log(response)
        localStorage.setItem('icuser', JSON.stringify(response.profileObj));
        this.forceUpdate()
    }
   filter = (value) =>{
        if(value != ''){
            let lists  = this.state.drivers.filter((data)=>data.language == value);
            this.setState({driversList : lists})
        }else{
            this.setState({
            driversList :this.state.drivers
            })
        }

   }
    render() {
        switch(this.state.page){
            case 1:
                return (
                    <div className="Home">
                        <Navbar bg="tranparent" expand="lg">
                            <Navbar.Brand href="#home"><img src={"https://instacar.in/wp-content/themes/instacar/images/Insta-car-01-2.png"} alt=""/></Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <div className="ic-form-home">
                            <div className="container text-center ic-heading-home">
                                <h1>Chauffeur Driven, On Demand.
                                </h1>
                            </div>
                            <div className="ic-form-1">
                                <Form>
                                    <Form.Row>
                                        <Col>
                                            <Form.Control as="select" onChange={e => this.state.from = e.target.value}>
                                                <option  value="" >From</option>
                                                <option value="1">Banglore</option>
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control as="select" onChange={e => this.state.to = e.target.value}>
                                                <option  value="">To</option>
                                                {this.state.place.map((data,key) => <option value={data.id} key={key}>{data.name}</option>)}
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <DatePicker
                                                selected={this.state.startDate}
                                                onChange={this.handleChange}
                                                minDate={new Date()}
                                            />
                                        </Col>
                                        <Col >
                                            <Button variant="primary"  onClick={this.formSubmit}>
                                                Submit
                                            </Button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                );
                break;
            case 2:
                return (
                    <div className="Home">
                        <Navbar bg="tranparent" expand="lg">
                            <Navbar.Brand href="#home"><img src={"https://instacar.in/wp-content/themes/instacar/images/Insta-car-01-2.png"} alt=""/></Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <div className="ic-form-home ic-form-calc">
                            <div className="container text-center ic-heading-home">
                                <h1>Select Driver
                                </h1>
                                <div className="row">
                                   <div md="3">
                                       <Form.Control as="select" onChange={e => this.filter(e.target.value)}>
                                           <option value="" >Language</option>
                                           <option value="Malayalam">Malayalam</option>
                                           <option value="Tamil">Tamil</option>
                                           <option value="Kannada">Kannada</option>
                                       </Form.Control>
                                   </div>
                                </div>
                                <br/>
                                <div className="row">
                                    {this.state.driversList.map((data,key) => {return(
                                            <Col md="4" style={{marginBottom:"10px"}} key={{key}}>
                                                <Card style={{ width: '18rem' }}>
                                                    <Card.Img variant="top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTt2OeS8bJu0U55outPHYA1axKvgzYzhP_jWKKZSH7ZK4domdFa" />
                                                    <Card.Body>
                                                        <Card.Title>Card Title</Card.Title>
                                                        <Card.Text style={{ color: 'grey' }}>
                                                            <ul style={{listStyleType:"none",textAlign:"left"}}>
                                                                <li><b>Name</b>: {data.name}</li>
                                                                <li><b>Age</b>: {data.age}</li>
                                                                <li><b>Language</b>: {data.language}</li>
                                                                <li><b>Rate</b>: {data.rate}Rs/km</li>
                                                                <li><b>Total</b>: {this.numberFormat(this.total(data.rate))}/-</li>
                                                            </ul>
                                                        </Card.Text>
                                                        <Button variant="primary" onClick={()=>{this.setState({driver:data.id,page:3,amt:this.total(data.rate)})}}>Select</Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        )}
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                );
                break;
            case 3:
                return (
                    <div className="Home">
                        <Navbar bg="tranparent" expand="lg">
                            <Navbar.Brand href="#home"><img src={"https://instacar.in/wp-content/themes/instacar/images/Insta-car-01-2.png"} alt=""/></Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <div className="ic-form-home ic-form-calc" style={{width:"40%"}}>
                            <div className="container text-center ic-heading-home">
                                <h1 style={{textAlign:"left",paddingLeft:"50px"}}>Confirm Booking
                                </h1>
                                <div className="row">
                                    {this.profile()}
                                </div>

                            </div>
                        </div>
                    </div>
                );
                break;
            case 4:
                let profile = JSON.parse(localStorage.getItem('icuser'))
                return (
                    <div className="Home">
                        <Navbar bg="tranparent" expand="lg">
                            <Navbar.Brand href="#home"><img src={"https://instacar.in/wp-content/themes/instacar/images/Insta-car-01-2.png"} alt=""/></Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <div className="ic-form-home ic-form-calc">
                            <div className="container text-center ic-heading-home">
                                <h1>Booking Successful
                                </h1>
                                <div className="row">
                                    <h1 className="text-center">Thank You {profile.name}!</h1>
                                    <br></br>

                                </div>
                                <div className="row ">
                                    <p className="text-center">You have successfully paid {this.numberFormat(this.state.amt)}/-</p>
                                </div>

                            </div>
                        </div>
                    </div>
                )
        }

    }
}
export default Welcome;
