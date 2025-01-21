import { handleErrorResponse } from "@/middlewares/errorhandling";
import { getTicketStatusCounts } from "@/services/ApiServices";
import React, {createContext,useContext,useMemo, useReducer} from "react";

const TicketStatusContext = createContext();

const initialState={
    requestCount:0,
    approvedCount:0,
    consumedCount:0
}

const ticketStatusReducer = (state,action) => {

    if (action.type === 'SET_COUNTS') {
        return {
            requestedCount:action.payload.requested_count,
            approvedCount: action.payload.approved_count,
            consumedCount:action.payload.consumed_count
        };
    }
    return state;
    }



export const TicketStatusProvider = ({children}) =>{
    const [ticketStatusCount,dispatch] = useReducer(ticketStatusReducer,initialState)


    const updateTicketStatusCount = async () => {
        try {
          const response = await getTicketStatusCounts()
          dispatch({
            type: 'SET_COUNTS',
            payload:{
                requested_count:response.data.requested_count,
                approved_count : response.data.approved_count,
                consumed_count: response.data.consumed_count
            
            }
        })
        } catch (error) {
         handleErrorResponse(error)
        }
    }

   

    const contextValue = useMemo(() => ({
        ticketStatusCount,
        updateTicketStatusCount
    }), [ticketStatusCount]);
    
    return(
        <TicketStatusContext.Provider value={contextValue}>
            {children}
        </TicketStatusContext.Provider>
    )
    }

export const useTicketStatus = () => useContext(TicketStatusContext)
