import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/store/configureStore';
import ShippingAddress from './ShippingAddress';
import { Box, Divider, Typography } from '@mui/material';
import { Password } from './Password';
import User from './User';

interface ProfileFormData {
    address: string;
    password: string;
}


const Profile: React.FC = () => {
    const { user } = useAppSelector((state) => state.account);
    const dispatch = useAppDispatch();

    return (
        <Box display='flex' gap={5} flexDirection={'column'} paddingLeft={5} paddingRight={5}>
        <Typography variant='h3'>Profile</Typography>
        <ShippingAddress user={user} dispatch={dispatch} />
        <User isGoogle={user?.isGoogle || false} user={user} dispatch={dispatch} />
        <Password isGoogle={user?.isGoogle || false} />
        </Box>);
};

export default Profile;
