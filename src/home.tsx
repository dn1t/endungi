import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Skeleton from 'react-loading-skeleton';
import Nav from './components/nav';
import MainBannerImage from './assets/main-banner-image.svg';
import { RecommendedUser } from './types';
import { Link } from 'react-router-dom';
import Layout from './components/layout';

interface ResultSuccess<T> {
  success: true;
  data: T;
}

interface ResultError {
  success: false;
  error: any;
}

type Result<T> = ResultSuccess<T> | ResultError;

const Home: React.FC = () => {
  const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>();
  const [showUserSearch, setShowUserSearch] = useState(false);

  useEffect(() => {
    fetch('/api/user/getRecommendedUsers')
      .then((res) => res.json())
      .then((getRecommendedUsersRes: Result<RecommendedUser[]>) => {
        if (!getRecommendedUsersRes.success) return;
        setRecommendedUsers(getRecommendedUsersRes.data);
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
          <section className='overflow-x-auto'>
            <div className='flex items-center max-w-5xl mx-auto px-5 sm:px-10 xl:px-0 py-24'>
              <div className='w-full sm:w-max'>
                <h1 className='font-bold text-black dark:text-white text-4xl sm:text-[44px] leading-[1.2] w-max'>
                  유저 정보와 통계를
                  <br />
                  모두 한 곳에서
                </h1>
                <p className='text-slate-600 dark:text-slate-300 text-md sm:text-lg leading-[1.3] mt-6 w-max'>
                  endungi.xyz는 엔둥이 여러분의 유저 정보를 모아
                  <br />
                  통계를 내고 한 눈에 보기 쉽게 정리해줘요.
                </p>
                {showUserSearch ? (
                  <form
                    className='flex mt-10'
                    onSubmit={(e) => {
                      e.preventDefault();
                      location.href = `/user/${
                        (e.target as unknown as HTMLInputElement[])[0].value
                      }`;
                      return false;
                    }}
                  >
                    <input
                      className='w-full sm:w-52 mr-2 font-medium text-base sm:text-[19px] bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all [transition-timing-function:_ease] dark:text-white px-4 py-2.5 sm:px-5 sm:py-3.5 block rounded-xl outline-none focus:[box-shadow:_0_0_0_3px_rgba(59,_130,_246,_.7)] dark:focus:[box-shadow:_0_0_0_3px_rgba(29,_78,_216,_.7)]'
                      autoFocus
                    />
                    <button className='flex-shrink-0 font-semibold text-base sm:text-[19px] bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 hover:transform hover:scale-[.98] transition-all [transition-timing-function:_ease] text-white w-max px-5 py-2.5 sm:px-7 sm:py-3.5 block rounded-xl'>
                      검색
                    </button>
                  </form>
                ) : (
                  <button
                    className='font-semibold text-base sm:text-[19px] bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 hover:transform hover:scale-[.98] transition-all [transition-timing-function:_ease] text-white w-max px-5 py-2.5 sm:px-7 sm:py-3.5 block rounded-xl mt-10'
                    onClick={() => setShowUserSearch(true)}
                  >
                    유저 검색하기
                  </button>
                )}
              </div>
              <img
                src={MainBannerImage}
                className='ml-auto h-48 lg:h-56 hidden md:block'
                alt=''
              />
            </div>
          </section>

          <section className='max-w-5xl mx-auto px-5 sm:px-10 xl:px-0 py-8'>
            <h2 className='font-bold text-black dark:text-slate-200 text-2xl'>
              주목할 만한 엔둥이
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3'>
              <>
                {new Array(3).fill(null).map((_, i) => {
                  if (!recommendedUsers) return;
                  const recommendedUser = recommendedUsers[i];

                  return (
                    <Link
                      to={`/user/${recommendedUser.username}`}
                      className='flex flex-col items-center border border-slate-100 dark:border-slate-900 shadow-md rounded-xl px-8 py-5 hover:bg-slate-100/30 dark:hover:bg-slate-900/30 hover:transform hover:scale-[.97] transition-all [transition-timing-function:_ease]'
                      key={i}
                    >
                      {recommendedUsers ? (
                        <div
                          className='h-14 w-14 bg-center bg-cover bg-no-repeat rounded-full border border-slate-100 dark:border-slate-900'
                          style={{
                            backgroundImage: `url('${recommendedUser.profileImage}')`,
                          }}
                        />
                      ) : (
                        <Skeleton className='h-14 w-14 rounded-full border-slate-100' />
                      )}
                      <h3 className='mt-2 font-[550] text-slate-900 dark:text-slate-100 text-lg'>
                        {recommendedUsers ? (
                          recommendedUser.nickname
                        ) : (
                          <Skeleton />
                        )}
                      </h3>
                      <p className='mb-3 text-center text-slate-700 dark:text-slate-300 text-[15px] line-clamp-2 [line-break:_anywhere]'>
                        {recommendedUsers ? (
                          recommendedUser.description
                        ) : (
                          <Skeleton />
                        )}
                      </p>
                      <div className='mt-auto flex flex-wrap justify-center gap-x-1.5 gap-y-1'>
                        {recommendedUsers ? (
                          recommendedUser.keywords.map((keyword, i) => (
                            <span
                              className='block border border-slate-100 dark:border-slate-900 rounded-full px-3.5 py-2 text-sm text-slate-600 dark:text-slate-400 leading-3'
                              key={i}
                            >
                              #{keyword}
                            </span>
                          ))
                        ) : (
                          <Skeleton />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </>
            </div>
          </section>
        </>
      </Layout>
    </div>
  );
};

export default Home;
