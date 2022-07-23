import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Nav from '../components/nav';
import { Result, UserInfo } from '../types';
import Layout from '../components/layout';
import rem from '../lib/rem';
import verifiedUsers from '../../verified.json';
import Verified from '../verified.svg';
import 'react-loading-skeleton/dist/skeleton.css';

const User: React.FC = () => {
  const params = useParams();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [bookmarks, setBookmarks] = useState<number>();
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  const [thumbnailImagesLoaded, setThumbnailImagesLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/user/getUserInfo/${params.username}`)
      .then((res) => res.json())
      .then((getUserInfo: Result<UserInfo>) => {
        if (!getUserInfo.success) {
          if (
            getUserInfo.error === 'notfound' ||
            getUserInfo.error.includes('Error: undefined')
          ) {
            alert('존재하지 않는 유저입니다.');
            return (location.href = '/');
          }
          return alert(getUserInfo.error);
        }
        setUserInfo(getUserInfo.data);

        if (getUserInfo.data.profileImage) {
          const profileImage = new Image();
          profileImage.onload = () => setProfileImageLoaded(true);
          profileImage.src =
            getUserInfo.data.profileImage ??
            'https://playentry.org/img/DefaultCardUserThmb.svg';
        }

        const thumbnailImagesLoadedTmp = [false, false, false];

        if (getUserInfo.data.projects.length > 0) {
          const thumbnailImage1 = new Image();
          thumbnailImage1.onload = () => {
            thumbnailImagesLoadedTmp[0] = true;
            if (
              thumbnailImagesLoadedTmp[0] &&
              thumbnailImagesLoadedTmp[1] &&
              thumbnailImagesLoadedTmp[2]
            )
              setThumbnailImagesLoaded(true);
          };
          thumbnailImage1.src = getUserInfo.data.projects.sort(
            (a, b) => Number(a.updated) - Number(b.updated)
          )[0]?.thumb;
        } else {
          thumbnailImagesLoadedTmp[0] = true;
          if (
            thumbnailImagesLoadedTmp[0] &&
            thumbnailImagesLoadedTmp[1] &&
            thumbnailImagesLoadedTmp[2]
          )
            setThumbnailImagesLoaded(true);
        }

        if (
          getUserInfo.data.projects.filter((project) => project.ranked !== null)
            .length > 0
        ) {
          const thumbnailImage2 = new Image();
          thumbnailImage2.onload = () => {
            thumbnailImagesLoadedTmp[1] = true;
            if (
              thumbnailImagesLoadedTmp[0] &&
              thumbnailImagesLoadedTmp[1] &&
              thumbnailImagesLoadedTmp[2]
            )
              setThumbnailImagesLoaded(true);
          };
          thumbnailImage2.src = getUserInfo.data.projects
            .filter((project) => project.ranked !== null)
            .sort((a, b) => Number(a.updated) - Number(b.updated))[0]?.thumb;
        } else {
          thumbnailImagesLoadedTmp[1] = true;
          if (
            thumbnailImagesLoadedTmp[0] &&
            thumbnailImagesLoadedTmp[1] &&
            thumbnailImagesLoadedTmp[2]
          )
            setThumbnailImagesLoaded(true);
        }

        if (
          getUserInfo.data.projects.filter(
            (project) => project.staffPicked !== null
          ).length > 0
        ) {
          const thumbnailImage3 = new Image();
          thumbnailImage3.onload = () => {
            thumbnailImagesLoadedTmp[2] = true;
            if (
              thumbnailImagesLoadedTmp[0] &&
              thumbnailImagesLoadedTmp[1] &&
              thumbnailImagesLoadedTmp[2]
            )
              setThumbnailImagesLoaded(true);
          };
          thumbnailImage3.src = getUserInfo.data.projects
            .filter((project) => project.staffPicked !== null)
            .sort((a, b) => Number(a.updated) - Number(b.updated))[0]?.thumb;
        } else {
          thumbnailImagesLoadedTmp[2] = true;
          if (
            thumbnailImagesLoadedTmp[0] &&
            thumbnailImagesLoadedTmp[1] &&
            thumbnailImagesLoadedTmp[2]
          )
            setThumbnailImagesLoaded(true);
        }
      })
      .catch((err) => {
        alert(`${err.name}: ${err.message}`);
      });

    fetch(`/api/user/getBookmarks/${params.username}`)
      .then((res) => res.json())
      .then((getBookmarks: Result<number>) => {
        if (!getBookmarks.success) return setBookmarks(-1);

        setBookmarks(getBookmarks.data);
      })
      .catch((err) => {
        alert(`${err.name}: ${err.message}`);
      });
  }, []);

  return (
    <div className='bg-white dark:bg-black min-h-screen'>
      <Helmet>
        <title>endungi</title>
      </Helmet>

      <Nav />

      <Layout>
        <>
          <section>
            <div className='flex items-center max-w-5xl mx-auto px-5 sm:px-10 xl:px-0 pt-5 xs:pt-10 pb-4'>
              <div className='grid [grid-template-columns:_4.5rem_calc(100%_-_7.25rem)] xs:[grid-template-columns:_6rem_calc(100%_-_7.25rem)] w-full'>
                {profileImageLoaded ? (
                  <div
                    className='h-[4.5rem] w-[4.5rem] xs:h-24 xs:w-24 bg-center bg-cover bg-no-repeat rounded-full border border-slate-100 dark:border-slate-900 flex-shrink-0'
                    style={{
                      backgroundImage: `url('${
                        userInfo?.profileImage ??
                        'https://playentry.org/img/DefaultCardUserThmb.svg'
                      }')`,
                    }}
                  />
                ) : (
                  <Skeleton className='h-[4.5rem] w-[4.5rem] xs:h-24 xs:w-24 rounded-full border border-slate-100 dark:border-slate-900 flex-shrink-0' />
                )}
                <div className='w-full ml-5'>
                  <h1 className='font-bold text-black dark:text-white text-3xl xs:text-4xl leading-[36px] xs:leading-[44px] w-full flex items-center'>
                    {userInfo?.nickname ?? <Skeleton width={rem(5)} />}
                    {userInfo?.username ? (
                      verifiedUsers.includes(userInfo.username) && (
                        <img src={Verified} className='h-5 w-5 ml-2' />
                      )
                    ) : (
                      <></>
                    )}
                    <div className='ml-auto'>
                      <a
                        href={userInfo?.shortUrl}
                        className={`hidden xs:block font-semibold text-base bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 hover:transform hover:scale-[.98] transition-all [transition-timing-function:_ease] text-white w-max px-5 py-2.5 rounded-xl${
                          userInfo ? '' : ' cursor-not-allowed'
                        }`}
                        target='_blank'
                        onClick={(e) => {
                          if (!userInfo) return e.preventDefault();
                        }}
                      >
                        마이페이지로 이동
                      </a>
                    </div>
                  </h1>
                  <div className='text-base text-slate-600 dark:text-slate-400 leading-3 mt-px w-max flex items-center gap-x-1'>
                    <span>
                      {userInfo?.role === 'admin' ? (
                        '관리자'
                      ) : userInfo?.role === 'teacher' ? (
                        '선생님'
                      ) : userInfo?.role === 'member' ? (
                        '학생'
                      ) : (
                        <Skeleton width={rem(1.7)} />
                      )}
                    </span>
                    <span>·</span>
                    <span>
                      {userInfo?.username ?? <Skeleton width={rem(4)} />}
                    </span>
                  </div>
                  <p className='text-base xs:text-lg text-slate-700 dark:text-slate-300 leading-[1.3] mt-2 w-full'>
                    {userInfo?.description ?? (
                      <Skeleton style={{ width: '40%' }} />
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className='max-w-5xl mx-auto px-5 sm:px-10 xl:px-0 pt-4 pb-8'>
            <h2 className='font-bold text-black dark:text-white text-2xl'>
              작품
            </h2>
            <div className='grid sm:grid-cols-3 gap-4 mt-3'>
              {thumbnailImagesLoaded ? (
                <div
                  className='lg:aspect-video bg-gradient-to-tr bg-center bg-cover bg-no-repeat from-red-700 to-yellow-600 text-2xl lg:text-3xl font-bold leading-[26px] lg:leading-8 rounded-2xl'
                  style={{
                    backgroundImage:
                      userInfo && userInfo?.projects.length > 0
                        ? `url(${
                            userInfo?.projects.sort(
                              (a, b) => Number(a.updated) - Number(b.updated)
                            )[0]?.thumb
                          }`
                        : undefined,
                  }}
                >
                  <div className='flex flex-col bg-gradient-to-t from-black/80 to-transparent justify-end px-5 py-4 lg:py-3.5 h-full rounded-2xl backdrop-blur-[8px]'>
                    <span className='text-white/60'>전체 작품</span>
                    <span className='text-white'>
                      {userInfo?.projects.length}개
                    </span>
                  </div>
                </div>
              ) : (
                <Skeleton className='h-[84px] sm:h-auto sm:aspect-video text-3xl font-bold leading-8 rounded-2xl' />
              )}
              {thumbnailImagesLoaded ? (
                <div
                  className='lg:aspect-video bg-gradient-to-tr bg-center bg-cover bg-no-repeat from-blue-700 to-emerald-600 text-2xl lg:text-3xl font-bold leading-[26px] lg:leading-8 rounded-2xl'
                  style={{
                    backgroundImage:
                      userInfo &&
                      userInfo?.projects.filter(
                        (project) => project.ranked !== null
                      ).length > 0
                        ? `url(${
                            userInfo?.projects
                              .filter((project) => project.ranked !== null)
                              .sort(
                                (a, b) => Number(a.updated) - Number(b.updated)
                              )[0]?.thumb
                          }`
                        : undefined,
                  }}
                >
                  <div className='flex flex-col bg-gradient-to-t from-black/80 to-transparent justify-end px-5 py-4 lg:py-3.5 h-full rounded-2xl backdrop-blur-[8px]'>
                    <span className='text-white/60'>인기 작품</span>
                    <span className='text-white'>
                      {
                        userInfo?.projects.filter(
                          (project) => project.ranked !== null
                        ).length
                      }
                      개
                    </span>
                  </div>
                </div>
              ) : (
                <Skeleton className='h-[84px] sm:h-auto sm:aspect-video text-3xl font-bold leading-8 rounded-2xl' />
              )}
              {thumbnailImagesLoaded ? (
                <div
                  className='lg:aspect-video bg-gradient-to-tr bg-center bg-cover bg-no-repeat from-violet-700 to-pink-600 text-2xl lg:text-3xl font-bold leading-[26px] lg:leading-8 rounded-2xl'
                  style={{
                    backgroundImage:
                      userInfo &&
                      userInfo?.projects.filter(
                        (project) => project.staffPicked !== null
                      ).length > 0
                        ? `url(${
                            userInfo?.projects
                              .filter((project) => project.staffPicked !== null)
                              .sort(
                                (a, b) => Number(a.updated) - Number(b.updated)
                              )[0]?.thumb
                          }`
                        : undefined,
                  }}
                >
                  <div className='flex flex-col bg-gradient-to-t from-black/80 to-transparent justify-end px-5 py-4 lg:py-3.5 h-full rounded-2xl backdrop-blur-[8px]'>
                    <span className='text-white/60'>스태프 선정</span>
                    <span className='text-white'>
                      {
                        userInfo?.projects.filter(
                          (project) => project.staffPicked !== null
                        ).length
                      }
                      개
                    </span>
                  </div>
                </div>
              ) : (
                <Skeleton className='h-[84px] sm:h-auto sm:aspect-video text-3xl font-bold leading-8 rounded-2xl' />
              )}
            </div>
          </section>
          <section className='max-w-5xl mx-auto px-5 sm:px-10 xl:px-0 pt-4 pb-8'>
            <h2 className='font-bold text-black dark:text-white text-2xl'>
              상세 정보
            </h2>
            <div className='grid grid-cols-2 3xs:grid-cols-3 xs:grid-cols-4 gap-y-3 border border-slate-100 dark:border-slate-900 shadow-sm xs:px-5 py-4 mt-3 rounded-2xl'>
              <div className='flex flex-col items-center'>
                <span className='font-medium text-sm text-gray-600 leading-4'>
                  작품 좋아요
                </span>
                {userInfo ? (
                  <span className='font-bold text-xl text-emerald-500 leading-6 mt-1'>
                    {userInfo.projects
                      .reduce((acc, cur) => (acc += cur.likes), 0)
                      .toLocaleString()}
                  </span>
                ) : (
                  <Skeleton className='h-6 w-12' />
                )}
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium text-sm text-gray-600 leading-4'>
                  작품 조회수
                </span>
                {userInfo ? (
                  <span className='font-bold text-xl text-blue-500 leading-6 mt-1'>
                    {userInfo.projects
                      .reduce((acc, cur) => (acc += cur.visits), 0)
                      .toLocaleString()}
                  </span>
                ) : (
                  <Skeleton className='h-6 w-12' />
                )}
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium text-sm text-gray-600 leading-4'>
                  작품 댓글
                </span>
                {userInfo ? (
                  <span className='font-bold text-xl text-purple-500 leading-6 mt-1'>
                    {userInfo.projects
                      .reduce((acc, cur) => (acc += cur.comments), 0)
                      .toLocaleString()}
                  </span>
                ) : (
                  <Skeleton className='h-6 w-12' />
                )}
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium text-sm text-gray-600 leading-4'>
                  작품 북마크
                </span>
                {bookmarks ? (
                  <span className='font-bold text-xl text-amber-500 leading-6 mt-1'>
                    {bookmarks === -1 ? '에러' : bookmarks.toLocaleString()}
                  </span>
                ) : (
                  <Skeleton className='h-6 w-12' />
                )}
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium text-sm text-gray-600 leading-4'>
                  팔로워
                </span>
                {userInfo ? (
                  <span className='font-bold text-xl text-rose-500 leading-6 mt-1'>
                    {userInfo.status.follower}
                  </span>
                ) : (
                  <Skeleton className='h-6 w-12' />
                )}
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium text-sm text-gray-600 leading-4'>
                  순위
                </span>
                {userInfo ? (
                  <span className='font-bold text-xl text-cyan-500 leading-6 mt-1'>
                    준비 중
                  </span>
                ) : (
                  <Skeleton className='h-6 w-12' />
                )}
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium text-sm text-gray-600 leading-4'>
                  커뮤니티 글
                </span>
                {userInfo ? (
                  <span className='font-bold text-xl text-indigo-500 leading-6 mt-1'>
                    준비 중
                  </span>
                ) : (
                  <Skeleton className='h-6 w-12' />
                )}
              </div>
              <div className='flex flex-col items-center'>
                <span className='font-medium text-sm text-gray-600 leading-4'>
                  순위
                </span>
                {userInfo ? (
                  <span className='font-bold text-xl text-zinc-500 leading-6 mt-1'>
                    준비 중
                  </span>
                ) : (
                  <Skeleton className='h-6 w-12' />
                )}
              </div>
            </div>
          </section>
          <section className='max-w-5xl mx-auto px-5 sm:px-10 xl:px-0 pt-4 pb-8'>
            <h2 className='font-bold text-black dark:text-white text-2xl'>
              타임라인
            </h2>
            <div className='flex flex-col gap-y-3.5 border border-slate-100 dark:border-slate-900 shadow-sm px-2 py-6 mt-3 rounded-2xl'>
              {userInfo ? (
                (() => {
                  const events: [string, string[], string, string?][] = [];

                  if (userInfo.created)
                    events.push([
                      userInfo.created,
                      [],
                      '엔트리 계정 생성',
                      'emerald-500',
                    ]);

                  userInfo.projects.forEach((project) => {
                    if (project.ranked)
                      events.push([
                        project.ranked,
                        [project.name],
                        `'%%' 인기 작품 선정`,
                        'blue-500',
                      ]);
                    if (project.staffPicked)
                      events.push([
                        project.staffPicked,
                        [project.name],
                        `'%%' 스태프 선정`,
                        'blue-500',
                      ]);

                    events.push([
                      project.created,
                      [project.name],
                      `'%%' 작품 생성`,
                    ]);
                  });

                  return events.sort((a, b) => Number(a[0]) - Number(b[0]));
                })().map((event, key) => {
                  return (
                    <div
                      className='grid [grid-template-columns:_6rem_1fr] gap-x-6 xs:gap-x-8 sm:gap-x-12'
                      key={key}
                    >
                      {event[3] ? (
                        <span
                          className={`font-semibold text-lg text-${event[3]} leading-6 text-right`}
                        >
                          {format(Number(event[0]), 'yy/MM/dd', {
                            locale: ko,
                          })}
                        </span>
                      ) : (
                        <span
                          className={`font-semibold text-lg text-slate-400 dark:text-slate-600 leading-6 text-right`}
                        >
                          {format(Number(event[0]), 'yy/MM/dd', {
                            locale: ko,
                          })}
                        </span>
                      )}
                      {event[3] ? (
                        <span
                          className={`font-semibold text-lg ${
                            event[3]
                              ? `text-${event[3]}`
                              : 'text-slate-400 dark:text-slate-600'
                          } leading-6`}
                        >
                          {event[2].split('%%').map((msg, index, arr) => (
                            <React.Fragment key={index}>
                              <span className={`text-${event[3]}`}>{msg}</span>
                              <span className={`text-${event[3]}`}>
                                {index !== arr.length - 1 && event[1][index]}
                              </span>
                            </React.Fragment>
                          ))}
                        </span>
                      ) : (
                        <span
                          className={`font-semibold text-lg ${
                            event[3]
                              ? `text-${event[3]}`
                              : 'text-slate-400 dark:text-slate-600'
                          } leading-6`}
                        >
                          {event[2].split('%%').map((msg, index, arr) => (
                            <React.Fragment key={index}>
                              <span className='text-slate-400/60 dark:text-slate-600/60'>
                                {msg}
                              </span>
                              <span className='text-slate-400 dark:text-slate-600'>
                                {index !== arr.length - 1 && event[1][index]}
                              </span>
                            </React.Fragment>
                          ))}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <>
                  <div className='grid [grid-template-columns:_6rem_1fr] gap-x-6 xs:gap-x-8 sm:gap-x-12'>
                    <span
                      className={`font-semibold text-lg text-slate-400 dark:text-slate-600 leading-6 text-right`}
                    >
                      <Skeleton className='h-6 max-w-[4rem]' />
                    </span>

                    <span
                      className={`font-semibold text-lg text-slate-400 dark:text-slate-600 leading-6`}
                    >
                      <Skeleton className='h-6 max-w-[12rem]' />
                    </span>
                  </div>
                  <div className='grid [grid-template-columns:_6rem_1fr] gap-x-6 xs:gap-x-8 sm:gap-x-12'>
                    <span
                      className={`font-semibold text-lg text-slate-400 dark:text-slate-600 leading-6 text-right`}
                    >
                      <Skeleton className='h-6 max-w-[3.5rem]' />
                    </span>

                    <span
                      className={`font-semibold text-lg text-slate-400 dark:text-slate-600 leading-6`}
                    >
                      <Skeleton className='h-6 max-w-[14rem]' />
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className='font-medium text-slate-700/70 mt-2 ml-0.5'>
              계정 생성, 인기 작품/스태프 선정 등의 기록이 표시됩니다.
            </div>
          </section>
        </>
      </Layout>
    </div>
  );
};

export default User;
