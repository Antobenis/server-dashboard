import React, { useEffect, useState } from 'react';
import { List } from 'antd'
import { useFetchNotification } from 'hooks/WebHooks'
import moment from 'moment'

const NotificationList = () => {
    const { data: notification, isloading: loading } = useFetchNotification();
    const [list, setList] = useState([]);

    function getNoOfDays(date) {
        let given = moment(date, "YYYY-MM-DD");
        let current = moment().startOf('day');
        let diff = given.diff(current);
        if(diff > 0){
            return moment.duration(given.diff(current)).asDays() + " Days";
        }
        else{
            return "Past .."
        }
    }

    useEffect(() => {
        if (notification !== undefined) {
            setList(notification?.data);
        }
    }, [notification]);

    return (
        <List
            className="demo-loadmore-list"
            loading={loading}
            itemLayout="vertical"
            dataSource={list}
            renderItem={(item) => (
                <List.Item>                                 
                    <div>{item.site_url} <span>{getNoOfDays(item.nextdue_date)}</span></div>
                </List.Item>
            )}
        />
    );
};
export default NotificationList;
