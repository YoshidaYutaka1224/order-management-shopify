/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment , useState , useEffect } from 'react';

const CustomLoader = () => {
    const [show, setShow] = useState(true);
    
    return (
        <Fragment>
            <div className={`loader-wrapper ${show ? '' : 'loderhide'}`} >
                <div className="loader bg-white">
                    <div className="whirly-loader"> </div>
                </div>
            </div>
        </Fragment>
    );
};

export default CustomLoader;