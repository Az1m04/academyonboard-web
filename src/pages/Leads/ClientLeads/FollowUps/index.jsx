import React, { useEffect, useState } from 'react';
import Icon, {
  ApartmentOutlined,
  MoreOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Badge, Button, Drawer, Dropdown, Tabs, Tag, Tooltip } from 'antd';
import { useParams, history, Link, connect } from 'umi';

import ClientLeadTable from '../ClientLeadTable/index.jsx';
import {
  EnvelopeAction,
  EnvelopeFillIcon,
  TelephoneFillIcon,
  TextIconAction,
  WhatsAppAction,
} from '@/utils/AppIcons.js';
import { CardHeading, PersonFill } from 'react-bootstrap-icons';

import ClientLeadActions from '../ClientLeadActions/index.jsx';
import { getUI, RenderTitle } from '../index.jsx';
import GetShortTimeString from '@/components/GetShortTimeString/index.js';

const { TabPane } = Tabs;
const FollowUps = ({ dispatch, leadData, loading, branchLeadStats }) => {
  const { followsUpTabName } = useParams();
  const [startIndex, setStartIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [viewSize, setViewSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleWhatsApp, setVisibleWhatsApp] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [recordDetails, setRecordDetails] = useState([]);
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isAssigneeVisible, setIsAssigneeVisible] = useState(false);
  const [hideDropDown, setHideDropDown] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expendedBackground, setExpendedBackground] = useState([]);
  const [actionKey, setActionKey] = useState({ id: null, key: null, title: null, subTitle: null });
  const getTabKey = () => {
    switch (followsUpTabName) {
      case 'all':
        return 'ALL';
      case 'today-follow-ups':
        return 'TODAY_FOLLOWUP';
      case 'today-done-follow-ups':
        return 'TODAY_FOLLOWUP_DONE';
      case 'missed-follow-ups':
        return 'MISSED';
      case 'planned-follow-ups':
        return 'PENDING';

      default:
        return 'All';
    }
  };
  const followUpVariable = 'follow-ups';
  const getClients = (search) => {
    dispatch({
      type: 'leads/getClientLeadData',
      payload: {
        query: {
          viewSize,
          startIndex,
          leadTypeId: 'LEAD_CUSTOMER',
          keyword: search,
          [followUpVariable]: getTabKey(),
        },
      },
    });
  };
  useEffect(() => {
    if (!actionKey?.key) {
      getClients();
    }
  }, [viewSize, keyword, startIndex, actionKey, followsUpTabName]);
  useEffect(() => {
    if (leadData) {
      dispatch({
        type: 'leads/branchLeadStats',
        payload: {
          query: {
            statsBy: 'FOLLOW_UP',
            statusId: 'LEAD_CUSTOMER',
          },
        },
      });
    }
  }, [leadData]);

  const onTabChange = () => {
    setKeyword('');
    setStartIndex(0);
    setCurrentPage(1);
  };
  const menu = (key) => {
    return (
      <ClientLeadActions
        actionKey={actionKey}
        setActionKey={setActionKey}
        record={key}
        getClients={getClients}
        hideDropDown={hideDropDown}
        setHideDropDown={setHideDropDown}
        partyId={key?.id}
        keyword={keyword}
      />
    );
  };
  const tabs = [
    {
      key: 'all',
      title: (
        <Badge
          count={branchLeadStats?.leadStudentStats?.allFollowUpCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">All</p>
        </Badge>
      ),
    },
    {
      key: 'today-done-follow-ups',
      title: (
        <Badge
          count={branchLeadStats?.leadStudentStats?.todayDoneFollowUpCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">{`Today's done follow-ups`}</p>
        </Badge>
      ),
    },
    {
      key: 'today-follow-ups',
      title: (
        <Badge
          count={branchLeadStats?.leadStudentStats?.todayFollowUpCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">{`Today's follow-ups`}</p>
        </Badge>
      ),
    },
    {
      key: 'missed-follow-ups',
      title: (
        <Badge
          count={branchLeadStats?.leadStudentStats?.missedFollowUpCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-2 m-0">Missed follow-ups</p>
        </Badge>
      ),
    },
    {
      key: 'planned-follow-ups',
      title: (
        <Badge
          count={branchLeadStats?.leadStudentStats?.pendingFollowUpCount}
          size="small"
          style={{
            fontSize: '10px',
            marginTop: '3px',
            backgroundColor: '#f59e0b',
            padding: '0px 4px 0px 4px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            width: '28px',
          }}
        >
          <p className="pt-2.5 pr-3 m-0">Planned follow-ups</p>
        </Badge>
      ),
    },
  ];
  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: 10,
      render: (_, __, index) => index + 1 + viewSize * (currentPage - 1),
    },
    {
      title: <div className="capitalize ml-2">name </div>,
      dataIndex: 'displayName',
      key: 'displayName',
      align: 'start',
      width: 250,
      sorter: (a, b) => a.displayName.length - b.displayName.length,
      sortDirections: ['ascend', 'descend'],

      render: (renderData, record) => (
        <div className="w-max ml-2">
          <div className="font-medium capitalize truncate flex pb-0">
            <p className="mb-0 mt-0.5 mr-0.5 text-yellow-500">
              <PersonFill />
            </p>
            <Tooltip
              title={<span className="capitalize">{record?.displayName}</span>}
              getPopupContainer={(node) => node.parentNode}
            >
              <p
                className="mb-0 mx-2 w-40"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {record?.displayName}
              </p>
            </Tooltip>
            <span
              className="bg-yellow-500 rounded text-white h-4 px-1 pb-0.5 mt-0.5 shadow-md"
              style={{ fontSize: '0.70rem' }}
            >
              {GetShortTimeString({ time: record?.createdAt })}
            </span>
          </div>

          <div className="space-y-1 mt-1">
            <div className="font-normal lowercase flex">
              <p className="mb-0 mt-1 mr-1 text-yellow-500">
                <EnvelopeFillIcon />
              </p>
              <p className="mb-0 mx-2"> {record?.primaryEmail?.toLowerCase()}</p>
            </div>
            <div className="flex">
              <p className="mb-0 mt-1 mr-1 text-yellow-500">
                <TelephoneFillIcon />
              </p>
              <p className="mb-0 mx-2">{record?.formattedPhone?.replace(/\s+/g, '')}</p>
            </div>
          </div>
        </div>
      ),
    },

    {
      title: <div className="capitalize">Purposes</div>,
      dataIndex: 'newNeeds',
      key: 'newNeeds',
      width: 200,
      render: (renderData) => (
        <Tooltip
          overlayInnerStyle={{
            color: '#1B568F',
            backgroundColor: 'white',
            fontWeight: '500',
            border: '0.5px solid #1B568F',
          }}
          title={
            renderData?.length > 1 && (
              <div className="font-normal cursor-pointer space-y-2 h-32 overflow-y-auto overflow-x-hidden">
                {renderData?.map((item) => (
                  <>
                    <Tag
                      color="blue"
                      style={{
                        padding: '2px',
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: '500',
                        color: 'rgb(27, 86, 143)',
                      }}
                      key={item?.id}
                    >
                      {item?.description}
                    </Tag>
                  </>
                ))}
              </div>
            )
          }
        >
          <div className="font-normal cursor-pointer">
            {renderData?.map((item, index) => (
              <>
                {index < 2 && (
                  <p key={item?.id} className="m-0 capitalize">
                    {item?.description}
                  </p>
                )}
              </>
            ))}

            {renderData?.length > 2 && (
              <p style={{ color: '#fa8c16' }} className="m-0  text-sm font-medium">
                ....see more
              </p>
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      title: <div className="capitalize">status</div>,
      dataIndex: 'status',
      key: 'status',
      align: 'start',
      width: 280,
      render: (renderData, record) => (
        <>
          <div className="flex">
            <Tooltip
              title="Last status"
              placement="top"
              getPopupContainer={(node) => node.parentNode}
            >
              <span className="px-1 font-semibold">LS</span>
            </Tooltip>
            <p
              className={`px-1 m-0 font-normal Capitalize ${
                renderData === 'Inactive' && 'text-red-500'
              }`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {renderData}
            </p>
          </div>

          <div className="flex mt-1">
            <Tooltip
              title="Current status"
              placement="top"
              getPopupContainer={(node) => node.parentNode}
            >
              <span className="px-1 font-semibold">CS</span>
            </Tooltip>
            <Tooltip
              title={record?.leadStatusType}
              placement="top"
              getPopupContainer={(node) => node.parentNode}
            >
              <div
                className="px-1 m-0 font-normal w-56 Capitalize"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {record?.leadStatusType}
              </div>
            </Tooltip>
          </div>

          <div className="flex mt-1">
            <Tooltip
              title="Follow up status"
              placement="top"
              getPopupContainer={(node) => node.parentNode}
            >
              <span className="px-1 font-semibold">FS</span>
            </Tooltip>
            <Tooltip
              title={record?.lastFollowUpStatus}
              placement="top"
              getPopupContainer={(node) => node.parentNode}
            >
              <div
                className="px-1 m-0 font-normal w-48 Capitalize"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {record?.lastFollowUpBy?.isInterested !== undefined
                  ? (record?.lastFollowUpBy?.isInterested === true && record?.lastFollowUpStatus) ||
                    (record?.lastFollowUpBy?.isInterested === false && 'Lead is not interested!')
                  : '--'}
              </div>
            </Tooltip>
          </div>
        </>
      ),
    },
    {
      title: 'Stats',
      dataIndex: '',
      align: 'start',
      width: 200,
      render: (__, record) => (
        <div className="flex space-x-4 items-center cursor-pointer p-0">
          <div
            onClick={() => {
              setActionKey({
                id: record?.id,
                title: 'Add note',
                key: 'ADD_NOTE',
                subTitle: 'Add note',
              });
            }}
          >
            <Badge
              size="small"
              title="Notes"
              count={record?.totalNotes}
              offset={[2, 20]}
              style={{ backgroundColor: '#111827' }}
            >
              <Tooltip title="Notes" placement="top" getPopupContainer={(node) => node.parentNode}>
                <Icon
                  style={{
                    color: '#F9FAFB',
                    fontSize: '1.1rem',
                    backgroundColor: '#4B5563',
                    borderRadius: '0.6rem',
                    padding: '0.15rem',
                  }}
                  component={CardHeading}
                />
              </Tooltip>
            </Badge>
          </div>
          <div>
            <Badge
              size="small"
              title="Visits"
              count={record?.totalVisits}
              offset={[2, 20]}
              style={{ backgroundColor: '#DC2626' }}
            >
              <Tooltip title="Visits" placement="top" getPopupContainer={(node) => node.parentNode}>
                <UserSwitchOutlined
                  style={{
                    color: '#F9FAFB',
                    fontSize: '1.1rem',
                    backgroundColor: '#4B5563',
                    borderRadius: '0.6rem',
                    padding: '0.15rem',
                  }}
                />
              </Tooltip>
            </Badge>
          </div>
          <div
            onClick={() => {
              setActionKey({
                id: record?.id,
                title: 'Activity timeline',
                key: 'ACTIVITY_TIMELINE',
                subTitle: 'Activity timeline',
              });
            }}
          >
            <Badge
              size="small"
              count={record?.totalActivities}
              title="Activities "
              offset={[2, 20]}
              style={{ backgroundColor: '#52c41a' }}
            >
              <Tooltip
                title="Activities "
                placement="top"
                getPopupContainer={(node) => node.parentNode}
              >
                <ApartmentOutlined
                  style={{
                    color: '#F9FAFB',
                    fontSize: '1.1rem',
                    backgroundColor: '#4B5563',
                    borderRadius: '0.6rem',
                    padding: '0.15rem',
                  }}
                />
              </Tooltip>
            </Badge>
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      align: 'start',
      width: 100,
      render: (_, record) => (
        <div className="flex space-x-3 items-center">
          <Tooltip
            title="Send whatsapp message"
            placement="top"
            getPopupContainer={(node) => node.parentNode}
          >
            <div
              className={`cursor-pointer icon`}
              onClick={() => {
                setVisibleWhatsApp(true);
                setRecordDetails([record]);
              }}
            >
              <WhatsAppAction />
            </div>
          </Tooltip>

          <Tooltip
            title="Send email message"
            placement="top"
            getPopupContainer={(node) => node.parentNode}
          >
            <div
              className="cursor-pointer"
              onClick={() => {
                setVisibleEmail(true);
                setRecordDetails([record]);
              }}
            >
              <EnvelopeAction />
            </div>
          </Tooltip>

          <Tooltip
            title="Send text message"
            placement="top"
            getPopupContainer={(node) => node.parentNode}
          >
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsPhoneVisible(true);
                setRecordDetails([record]);
              }}
            >
              <TextIconAction />
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      width: 60,
      render: (_, record) => (
        <div>
          <Dropdown
            getPopupContainer={leadData?.totalCount > 5 ? (node) => node.parentNode : null}
            overlay={menu(record)}
            trigger={['click']}
            placement={'bottomRight'}
            visible={hideDropDown[record.id] && !actionKey?.id}
            onVisibleChange={(value) =>
              setHideDropDown({
                [record.id]: value,
              })
            }
          >
            <MoreOutlined
              onClick={() => {
                setHideDropDown({
                  [record.id]: true,
                });
              }}
              className="text-lg cursor-pointer hover:text-yellow-600 "
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white my-16">
      <Tabs
        defaultActiveKey={followsUpTabName}
        className={`w-full `}
        onChange={onTabChange}
        onTabClick={(e) => history.push(`/leads/client/branch/follow-ups/${e?.toLowerCase()}`)}
        activeKey={followsUpTabName}
      >
        {tabs.map(({ key, title }) => (
          <TabPane key={key} tab={<span className="mx-2.5">{title}</span>}>
            {key === followsUpTabName && (
              <ClientLeadTable
                leadLoading={{ loading }}
                leadData={leadData}
                leadType="student"
                purpose="lead"
                keyword={keyword}
                setKeyword={setKeyword}
                viewSize={viewSize}
                setViewSize={setViewSize}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                startIndex={startIndex}
                setStartIndex={setStartIndex}
                columns={columns}
                visibleWhatsApp={visibleWhatsApp}
                setVisibleWhatsApp={setVisibleWhatsApp}
                visibleEmail={visibleEmail}
                setVisibleEmail={setVisibleEmail}
                recordDetails={recordDetails}
                setRecordDetails={setRecordDetails}
                isNoteVisible={isNoteVisible}
                setIsNoteVisible={setIsNoteVisible}
                isPhoneVisible={isPhoneVisible}
                setIsPhoneVisible={setIsPhoneVisible}
                isAssigneeVisible={isAssigneeVisible}
                setIsAssigneeVisible={setIsAssigneeVisible}
                hideDropDown={hideDropDown}
                setHideDropDown={setHideDropDown}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                expendedBackground={expendedBackground}
                setExpendedBackground={setExpendedBackground}
                getClients={getClients}
              />
            )}
          </TabPane>
        ))}
      </Tabs>
      <Link to="/leads/client/addlead">
        <Button
          style={{
            backgroundColor: 'rgb(27, 86, 143)',
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            border: 'none',
            height: '60px',
            width: '60px',
          }}
          shape="circle"
          icon={<PlusOutlined style={{ fontSize: '2rem', color: '#fff' }} />}
        />
      </Link>
      <Drawer
        title={RenderTitle(actionKey?.key, actionKey)}
        placement="right"
        bodyStyle={{ padding: '0' }}
        headerStyle={{ padding: '5px 18px 5px 24px' }}
        onClose={() => setActionKey({ id: null, key: null, title: null, subTitle: null })}
        visible={actionKey?.key}
        width={550}
      >
        {getUI(actionKey?.key, actionKey, setActionKey)}
      </Drawer>
    </div>
  );
};

export default connect(({ leads, loading }) => ({
  leadData: leads?.clientLeadData,
  loading: loading?.effects['leads/getClientLeadData'],
  branchLeadStats: leads?.branchLeadStats,
}))(FollowUps);
