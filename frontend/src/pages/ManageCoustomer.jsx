import React from 'react'


export const ManageCoustomer = () => {
    return (
        <section className="section">
            <div className="row align-items-top">
                <div className="col-lg-6">
                    <div className="row m-3">
                        <div className="card col-lg-3 m-4" >
                            <div className="card-header">
                                Balance
                            </div>
                            <div className="card-body">
                                -
                            </div>
                        </div>

                        <div className="card col-lg-3 m-4">
                            <div className="card-header">
                                Total Days
                            </div>
                            <div className="card-body">
                                15
                            </div>
                        </div>
                        <div className="card col-lg-3 m-4" >
                            <div className="card-header">
                                Amount
                            </div>
                            <div className="card-body">
                                1290.0
                            </div>
                        </div>
                        <div className="input-group col-lg-12 mx-2 my-1 ">
                            <span className="input-group-text" id="basic-addon1">Firstname</span>
                            <input type="text" className="form-control" placeholder="Firstname" aria-label="Firstname" value="yagnik" />
                        </div>
                        <div className="input-group col-lg-12 mx-2 my-1 ">
                            <span className="input-group-text" id="basic-addon1">Lastname</span>
                            <input type="text" className="form-control" placeholder="Lastname" aria-label="Lastname" />
                        </div>
                        <div className="input-group col-lg-12 mx-2 my-1 ">
                            <span className="input-group-text" id="basic-addon1">Email</span>
                            <input type="email" className="form-control" placeholder="Email" aria-label="Email" />
                        </div>
                        <div className="input-group col-lg-12 mx-2 my-1 ">
                            <span className="input-group-text" id="basic-addon1">Date of birth</span>
                            <input type="date" className="form-control" placeholder="Date of birth" aria-label="Date of birth" />
                        </div >
                        {/* <div className="input-group col-lg-12 mx-2 my-1 "><i class="telephone"></i></div> */}

                    </div>

                </div>
                <div className="col-lg-6">
                    <div className="row m-3">
                        <div className="card ">
                            <div className="card-header">
                                Offer Plans - Trial week offer
                            </div>
                            <div className="card-body">
                                wellness FD up to 1500
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </section>



    )
}

export default ManageCoustomer