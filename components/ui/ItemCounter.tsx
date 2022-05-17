import { FC } from "react";

import { Box, IconButton, Typography } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface Props {
  currentValue: number;
  maxValue: number; //Product in stock
  updatedQuantity: (newValue: number) => void;
}

export const ItemCounter: FC<Props> = ({ currentValue, updatedQuantity, maxValue }) => {
  const addOrRemove = (value: number) => {
    const newValue = currentValue + value;
    if (newValue < 1 || newValue > maxValue) return;
    updatedQuantity(newValue);
  };

  return (
    <Box display="flex">
      <IconButton onClick={() => addOrRemove(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }} fontSize={30}>
        {currentValue}
      </Typography>
      <IconButton onClick={() => addOrRemove(+1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
