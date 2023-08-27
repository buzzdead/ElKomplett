import { Grid, Box, TextField, Button } from "@mui/material"
import AppTextInput from "app/components/AppTextInput"
import { useFieldArray, Controller } from "react-hook-form"

interface Props {
    control: any
    hk: string
    id: number
}

export const HeaderKey = ({control, hk, id}: Props) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `${id}.${hk}.specification`,
      })
    return (
        <>
          <Grid container sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
            <Grid item xs={2}>
              <AppTextInput control={control} label={hk} name={`${id}.${hk}.key`} />
            </Grid>
            {fields.map((field, index) => (
              <Box key={field.id} display='flex' alignItems='center'>
                <Box >
                  <Controller
                    name={`specification[${id}.${hk}].values.${index}`}
                    control={control}
                    render={({ field }) => <TextField {...field} label={`Values ${index + 1}`} />}
                  />
                </Box>
                <Box ml={2}>
                  <Button variant='outlined' color='secondary' onClick={() => remove(index)}>
                    Remove
                  </Button>
                </Box>
              </Box>
            ))} </Grid>
            <Box mt={2}>
              <Button
                variant='outlined'
                color='success'
                onClick={() => append({ key: '', values: [] })}
              >
                Add Value
              </Button>
            </Box>
          </>
    )
}