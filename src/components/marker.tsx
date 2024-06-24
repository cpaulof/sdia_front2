import React, { useEffect, useState } from "react";
import PropTypes, {InferProps} from 'prop-types';


type propTypes = {
    index:number|string,
    className?: string;
}

const defaultProps: propTypes = {
    index: -1,
    className: 'marker'
}

export default function Marker({index, className}:propTypes=defaultProps){
    return <div className={className}><p>{index}</p></div>
}