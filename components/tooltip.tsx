import { Dispatch, SetStateAction } from "react";

export interface TooltipData {
    fullname: string;
    category: string;
    details: string;
    x: number;
    y: number;
}

interface TooltipProps {
    role: string;
    tooltip: TooltipData;
    setTooltip: Dispatch<SetStateAction<TooltipData | null>>;
}

const Tooltip = ({
    role,
    tooltip,
    setTooltip,
}: TooltipProps) => {
    return (
        <div 
            style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                transition: 'left 0.1s ease, top 0.1s ease',
            }} 
            className={`absolute bg-primary px-3 py-1.5 rounded-[4px]`}
            onMouseLeave={() => (role == 'user') && setTooltip(null)}
        >
            <p><strong>Full Name</strong>: {tooltip.fullname}</p>
            <p><strong>Category</strong>: {tooltip.category}</p>
            <p><strong>Details</strong>: {tooltip.details}</p>
        </div>
    );
};

export default Tooltip;