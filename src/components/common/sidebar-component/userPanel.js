import React, { Fragment } from 'react';
import man from '../../../assets/images/dashboard/boy-2.png'
import { Link } from 'react-router-dom';
import { Edit } from 'react-feather';
import LanguageSelector from '../../../ChangeLanguage';

const UserPanel = ({adminName}) => {
    const url= '';

    return (
        <Fragment>
            <div className="sidebar-user text-center">
                <div>
                    <img className="img-60 rounded-circle lazyloaded blur-up" src={url ? url : man} alt="#" />
                    <div className="profile-edit">
                        <Link to="#">
                            <Edit />
                        </Link>
                    </div>
                </div>
                <h6 className="mt-3 f-14">{adminName}</h6>
                <div style={{ marginTop : "5px"}}>
                    <LanguageSelector />
                </div>
            </div>
        </Fragment>
    );
};

export default UserPanel;