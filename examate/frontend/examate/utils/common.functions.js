import { format } from "date-fns";

const formatTimedata = (timeData) => {
    return format(new Date(timeData), "dd-MMMM-yyyy")
}
export {formatTimedata};