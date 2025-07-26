export const initialToastState = {
    type: 'success',
    title: "",
    message: "",
    duration: 3000,
    show: false,
    position: 'top',
};

export const toastReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_TOAST': 
            return {
                ...state,
                ...action.payload,
                show: true
            };
            break;
            
        case 'HIDE_TOAST':
            return {
                ...state,
                show: false,
            };
            break;
    
        default:
            return state;
            break;
    }
};

let toastDispatch = null;

export const registerDispatch = (dispatch) => {
   toastDispatch = dispatch;
};

export const showToast = ({
    type = 'success',
    duration = 3000,
    title,
    message,
    position = 'top'
}) => {   
    if(!toastDispatch) return;

    
    toastDispatch({
        type: 'SHOW_TOAST',
        payload: { type, title, message, duration, position }
    });
};

export const hideToast = () => {
    if(!toastDispatch) return;

    toastDispatch({
        type: 'HIDE_TOAST'
    });
};