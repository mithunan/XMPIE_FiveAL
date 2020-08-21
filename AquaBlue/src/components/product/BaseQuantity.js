/**
 * A component to display units of measure information of a product
 *
 * @param {object} quantityConfig - ProductQuantityModel containing data regarding the quantities of the product
 * @param {string} additionalClassName - a className that is added to the component (can be used to set invalid class).
 * @param {function} onChange - the callback function that fires when value was changed.
 * @param {string} id - a unique ID for the component.
 * @param {number} quantity - the current quantity.
 */


import { debounce } from 'throttle-debounce'
import React, { Component } from 'react'
import './BaseQuantity.scss'

const MAX_VALUE = 2147483646

class BaseQuantity extends Component {

    constructor(props) {
        super(props)

        this.onValueChange = this.onValueChange.bind(this)
    }

    getValueFromRange = (options, value) => {
        if (options.length === 0) {
            return null
        }
        // if not in any range, use the minimum value.
        let selected = options.find((item) => { return value === item.Value })
        if (selected === undefined) {
            selected = options[0]
        }

        return selected
    }

    onValueChange(e) {
        e.persist();
        this.debounced(e);
    }

    onKeyDown = (e) => {
        if (e.key === '.' || e.key === '-' || e.key === '+' || e.key === '=') {
            e.preventDefault()
            return false
        }
    }

    debounced = debounce(300, (e) => {
        if (e.target.value > MAX_VALUE) {
            e.target.value = MAX_VALUE
        }
        e.target.value = parseInt(e.target.value)
        this.props.onChange(e)

    });

    render() {
        const { quantityConfig, quantity, additionalClassName, onChange, id } = this.props

        if (!quantityConfig) {
            return null
        }

        const selectedDropDownItem = quantityConfig.Options && this.getValueFromRange(quantityConfig.Options, quantity)

        return (<div className='product-quantity'>
            {!quantityConfig.Changeable &&    // READ ONLY LABEL
                <div className='ro-quantity-wrapper'>
                    <span className={'quantity-control quantity-label ' + additionalClassName} id={'quantity_' + id}>{quantity}</span>
                </div>
            }
            {quantityConfig.Changeable && quantityConfig.Options === null && // TEXT BOX
                <div className='txt-quantity-wrapper'>
                    <input id={'quantity_' + id} type={'number'} className={'quantity-control quantity-input ' + additionalClassName}
                        onChange={this.onValueChange} defaultValue={!isNaN(quantity) ? parseInt(quantity) : null}
                        onKeyDown={this.onKeyDown}
                        onWheel={(e) => { e.preventDefault; return false }} />
                </div>
            }
            {quantityConfig.Changeable && quantityConfig.Options != null && quantityConfig.Options.length && // DROPDOWN
                <div className='dd-quantity-wrapper'>
                    <select id={'quantity_' + id} onChange={onChange} className={'quantity-control quantity-dropdown ' + additionalClassName} defaultValue={selectedDropDownItem.Value}>
                        {quantityConfig.Options.map((item) => {
                            return <option key={item.Value} value={item.Value} >{item.Name}</option>
                        })}
                    </select>
                </div>
            }
        </div>)
    }
}
export default BaseQuantity
