import React from 'react';
import Link from 'next/link';
import Error from 'next/error';
import { API, graphqlOperation } from 'aws-amplify';

import Head from '../../components/Head';
import Dropdown from '../../components/Dropdown';
import AddToCuration from '../../components/AddToCuration';
import Vote from '../../components/post/Vote';
import useCognitoUser from '../../helpers/hooks/useCognitoUser';
import { viewPost } from '../../src/graphql/mutations';
import Tags from '../../components/Tags';
import TagsContext from '../../context/TagsContext';
import { licenses } from '../../helpers/constants';

const Post = ({ post }) => {
  const { id } = post;
  const canvasRef = React.useRef();
  const [resolutions, setResolutions] = React.useState([]);
  const [imageSrc, setImageSrc] = React.useState(post.thumb);
  const user = useCognitoUser();

  // scale canvas and load image
  React.useEffect(() => {
    if (post) {
      const fetchData = async () => {
        // get resolutions
        const fetchedResolutions = await API.graphql({
          query: /* GraphQL */ `
            query GetPost($id: ID!) {
              getPost(id: $id) {
                resolutions {
                  resMode
                  url
                  thumb
                }
              }
            }
          `,
          variables: { id: post.id },
          authMode: 'API_KEY',
        });
        const res = fetchedResolutions.data.getPost.resolutions;
        setImageSrc(res[res.length - 1].url);
        setResolutions(res);

        API.graphql({
          ...graphqlOperation(viewPost, { id: post.id }),
          authMode: 'API_KEY',
        });
      };
      fetchData();
    }
  }, [post]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas.offsetWidth !== 300) {
      const image = new Image();
      image.onload = () => {
        // TODO: find better ways to resample on low res
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.width, image.height);
      };
      image.src = imageSrc;
    }
  }, [imageSrc]);

  React.useEffect(() => {}, [id]);

  const dropdownRes = resolutions.map((res, i) => ({
    key: res.url,
    value: res.resMode,
    selected: i === resolutions.length - 1,
  }));

  if (!post) return <Error statusCode={404} />;

  return (
    <div className="inline-flex flex-col justify-center text-left p-4 md:px-8 w-full">
      <Head title={post.title} description={post.description} />
      <div className="flex flex-row justify-between">
        <Link href="/">
          <a className="opacity-75 hover:opacity-50 back">
            <i className="fas fa-arrow-left"></i> Back
          </a>
        </Link>
        {resolutions.length && (
          <Dropdown
            size="sm"
            options={dropdownRes}
            handleChange={(url) => setImageSrc(url)}
          />
        )}
      </div>
      <div className="relative mt-4 text-center text-xl align-middle flex flex-row items-center md:space-x-4 md:text-3xl navigation">
        {/* TODO: Add swiping support for mobile https://codesandbox.io/s/qq7759m3lq?module=/src/Carousel.js&file=/src/Carousel.js */}
        <Link href="#">
          <a className="absolute left-0 bg-secondary rounded-r pr-1 md:static md:bg-transparent md:pr-0 arrow">
            <i className="fas fa-chevron-left"></i>
          </a>
        </Link>
        <div className="w-full">
          <canvas
            ref={canvasRef}
            className="img shadow-2xl w-full"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
        <Link href="#">
          <a className="absolute right-0 bg-secondary rounded-l pl-1 md:static md:bg-transparent md:pl-0 arrow">
            <i className="fas fa-chevron-right"></i>
          </a>
        </Link>
        <style jsx>{`
          .navigation .arrow {
            opacity: 0.75;
          }

          .arrow:hover {
            opacity: 0.75 !important;
          }

          .back {
            top: -1.5em;
          }

          @media (min-width: 1024px) {
            .back {
              top: 0;
            }

            .navigation .arrow {
              opacity: 0;
            }
            .navigation:hover .arrow {
              opacity: 1;
            }
          }
        `}</style>
      </div>
      <div className="mt-4 px-3 py-1 text-center text-xs w-full flex flex-row justify-around">
        <AddToCuration postID={id} />
        {user && user.username === post.userID && (
          <Link href="/post/edit/[id]" as={`/post/edit/${id}`}>
            <a>
              <i className="fas fa-edit mr-1"></i> Edit
            </a>
          </Link>
        )}
      </div>
      <div className="pt-8 justify-between flex flex-row">
        <div className="flex-col">
          <Vote id={id} initialScore={post.totalScore} />
        </div>
        <div className="flex flex-row justify-between w-full">
          <div className="flex-col">
            <h1 className="text-2xl italic font-semibold">{post.title}</h1>
            <span className="opacity-75">by </span>
            <Link href="/profile/[uid]" as={`/profile/${post.userID}`}>
              <a className="opacity-100">{post.userID}</a>
            </Link>
          </div>
          <div className="flex-col select-none opacity-75 text-right w-48 md:w-auto">
            <div className="md:inline font-semibold px-3 py-1 text-sm">
              <i className="far fa-heart"></i> 34
            </div>
            <div
              className="cursor-help md:inline font-semibold px-3 py-1 text-sm ml-1"
              title="Coming soon!"
            >
              <i className="far fa-comments"></i> 0
            </div>
            <div className="md:inline font-semibold px-3 py-1 text-sm ml-1">
              <i className="far fa-eye"></i> {post.totalViews}
            </div>
            <div className="px-3 py-1 text-lg text-center w-full hidden md:block">
              <a
                href={
                  post.license !== 'copyright'
                    ? licenses[post.license].link ??
                      `https://creativecommons.org/licenses/${post.license.replace(
                        '_',
                        '-'
                      )}/4.0/`
                    : ''
                }
                className={
                  post.license === 'copyright' &&
                  'cursor-text hover:opacity-100 hover:shadow-none'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={licenses[post.license].icon} />{' '}
                {licenses[post.license].name}
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="opacity-75 mt-4">{post.description}</p>
      <nav className="mt-4">
        {/* TODO: implement inline editing */}
        <TagsContext.Provider value={{ tags: post.tags }}>
          <Tags />
        </TagsContext.Provider>
      </nav>
      <div className="cursor-help  mt-4 opacity-75 md:hidden">
        <a
          href={
            post.license !== 'copyright' &&
            (licenses[post.license].link ??
              `https://creativecommons.org/licenses/${post.license.replace(
                '_',
                '-'
              )}/4.0/`)
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className={licenses[post.license].icon} />{' '}
          {licenses[post.license].name}
        </a>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ query: { id }, res }) => {
  const fetchData = await API.graphql({
    query: /* GraphQL */ `
      query GetPost($id: ID!) {
        getPost(id: $id) {
          id
          title
          description
          license
          createdAt
          userID
          thumb
          totalViews
          totalScore
          tags {
            items {
              tagName
            }
          }
        }
      }
    `,
    variables: { id },
    authMode: 'API_KEY',
  });
  const post = fetchData.data.getPost;
  if (!post) {
    res.statusCode = 404;
  }
  return {
    props: {
      post,
    },
  };
};

export default Post;
