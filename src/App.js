import React from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import CurrencyInput from './CurrencyInput';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './App.css';

const incomeSources = ["allowance", "job", "others"];
const expenseSources = ["school", "travel", "others"];

class InputRow extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.handleChange(event, this.props.type, this.props.sourceName);
  }
  
  render() {
    return (
      <Form.Row className="mb-1">
        <Col xs={2} className="text-left">
          <Form.Label>{this.props.sourceName}</Form.Label>
        </Col>
        <Col xs={6}>  
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <CurrencyInput type="text" className="form-control" onChange={this.onChange} value={this.props.value.amount} />
          </InputGroup>
        </Col>
        <Col xs={4}>
          <InputGroup>
            <Form.Control as="select" onChange={this.onChange} value={this.props.value.interval} >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </Form.Control>
          </InputGroup>
        </Col>        
      </Form.Row>
    )
  }
}

const calculateSavings = stateObject => {
  const income = stateObject.income;
  const expenses = stateObject.expenses;
  let annualIncome = 0;
  let annualExpenses = 0;


  for (const source in income) {
    let incomeSource = income[source];

    switch (incomeSource.interval) {
      case "Daily":
        annualIncome += Number(incomeSource.amount) * 365;
        break;
      case "Weekly":
        annualIncome += Number(incomeSource.amount) * 52;
        break;
      case "Monthly":
        annualIncome += Number(incomeSource.amount) * 12;
        break;
      default:
        annualIncome += Number(incomeSource.amount);
    }
  }

  for (const source in expenses) {
    let expenseSource = expenses[source];

    switch (expenseSource.interval) {
      case "Daily":
        annualExpenses += Number(expenseSource.amount) * 365;
        break;
      case "Weekly":
        annualExpenses += Number(expenseSource.amount) * 52;
        break;
      case "Monthly":
        annualExpenses += Number(expenseSource.amount) * 12;
        break;
      default:
        annualExpenses += Number(expenseSource.amount);
    }
  }

  return annualIncome - annualExpenses;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    let initValue = {
      income: {},
      expenses: {}
    }

    incomeSources.forEach(source => {
      initValue.income[source] = {
        amount: "0.00",
        interval: "Weekly"
      }
    })

    expenseSources.forEach(source => {
      initValue.expenses[source] = {
        amount: "0.00",
        interval: "Weekly"
      }
    })

    this.state = initValue;

    this.onChange = this.onChange.bind(this);
  }

  onChange(event, type, sourceName) {
    let stateInstance = this.state;
    let target = (event.target.type === "text" ? "amount" : "interval")

    stateInstance[type][sourceName][target] = event.target.value

    this.setState(stateInstance);
  }

  render() {
    return (
      <div className="App">
        <h2>Student Budget Calculator</h2>
          <Container className="my-3">
            <Col xs={{span: 8, offset: 2}} id="income" className="p-4">
              <h3>Income</h3>
              {incomeSources.map(sourceName => {
                return (
                  <InputRow handleChange={this.onChange} type="income" sourceName={sourceName} value={this.state.income[sourceName]} />
                )
              })}
            </Col>
          </Container>
          <Container className="my-3">
            <Col xs={{span: 8, offset: 2}} id="expenses" className="p-4">
              <h3>Expenses</h3>
              {expenseSources.map(sourceName => {
                return (
                  <InputRow handleChange={this.onChange} type="expenses" sourceName={sourceName} value={this.state.expenses[sourceName]} />
                )
              })}
            </Col>
          </Container>
          <Container className="my-3">
            <Col xs={{span: 8, offset: 2}} id="summary" className="p-4">
              <h3>Annual savings</h3>
              <p>You would save ${calculateSavings(this.state)} every year</p>
            </Col>
          </Container>
      </div>
    );
  }
}

export default App;
