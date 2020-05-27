import { SET_LIST_FILTER_DATA, SET_LIST_FILTER_DATA_TOTAL, SET_LIST_FILTER_COLUMN } from "../constant/actionTypes";

const initial_state = {
    listFilterData : null,
    listFilterDataTotal: 0,
    filterColumn : {
        orderPrinter : true,
        orderNumber : true,
        Products : true,
        ShippingLabels : true,
        Notes : true,
        ShippingMethod : true,
        PaymentMethod : true,
        OrderTotal : true,
        TrackingNumber : true,
        Signature : true,
        ShippingAddressAll : true,
        ShippingAddress : {
            FirstName : true,
            LastName : true,
            Company : true,
            Telephone : true,
            AddressLine1 : true,
            AddressLine2 : true,
            City : true,
            Province : true,
            Zip : true,
            Country : true,
        },
        BillingAddressAll : true,
        BillingAddress : {
            FirstName : true,
            LastName : true,
            Company : true,
            Telephone : true,
            AddressLine1 : true,
            AddressLine2 : true,
            City : true,
            Province : true,
            Zip : true,
            Country : true,
        },
        CustomerInformationAll : true,
        CustomerInformation : {
            Email : true,
            Phone : true,
            OrderCount : true,
            CustomerNote : true
        }
    }
};

export default (state = initial_state, action) => {
    switch (action.type) {

        case SET_LIST_FILTER_DATA:
            return { ...state, loading: false, listFilterData: action.listFilterData };

        case SET_LIST_FILTER_DATA_TOTAL:
            return { ...state, loading: false, listFilterDataTotal: action.listFilterDataTotal };

        case SET_LIST_FILTER_COLUMN:
            return { ...state, loading: false, filterColumn: action.filterColumn };
            
        default: return { ...state };
    }
}
