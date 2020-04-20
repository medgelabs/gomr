import React from 'react'
import { configure, shallow }  from 'enzyme'
import { expect } from 'chai'
import Adapter from 'enzyme-adapter-react-16'

// Component
import App from './App'

configure({ adapter: new Adapter() })

const wrapper = shallow(<App />)

describe('<App />', () => {
  it('should render without exploding', () => {
    expect(wrapper).to.have.lengthOf(1)
  })
})
