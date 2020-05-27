import React, { Fragment } from 'react';
import { Home, Users } from 'react-feather';
import { Link } from 'react-router-dom'

const Title = props => {
    const breadcrumb = props;

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <div className="page-header-left">
                                <h3>{breadcrumb.title}</h3>
                                <ol className="breadcrumb pull-right">
                                    <li className="breadcrumb-item">
                                        <Link to="/tag">
                                            <Users />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">{breadcrumb.parent}</li>
                                    {
                                        breadcrumb.child
                                        ?
                                        <li className="breadcrumb-item active">{breadcrumb.child}</li>
                                        :
                                        null
                                    }
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Title;
