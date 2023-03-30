import Head from 'next/head';
import Footer from '../components/Footer';
import { client } from '../lib/apollo';
import { gql } from '@apollo/client';

export default function SlugPage({ post }) {
  post ? (
    <div>
      <Head>
        <title>Headless WP Next Starter</title>
        <link rel='icon' href='favicon.ico'></link>
      </Head>

      <main>
        <div className='siteHeader'>
          <h1 className='title'>{post.title}</h1>
          <p>
            ✍️ &nbsp;&nbsp;
            {`${post.author.node.firstName} ${post.author.node.lastName}`} | 🗓️
            &nbsp;&nbsp;{new Date(post.date).toLocaleDateString()}
          </p>
        </div>
        <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
      </main>

      <Footer></Footer>
    </div>
  ) : <div>空です。</div>;
}

const GET_POST_BY_URI = gql`
    query GetPostByURI($id: ID!) {
      post(id: $id, idType: URI) {
        title
        content
        date
        author {
          node {
            firstName
            lastName
          }
        }
      }
    }
  `


export async function getStaticProps({ params }) {
  //  the params argument for this function corresponds to the dynamic URL segments
  //  we included in our page-based route. So, in this case, the `params` object will have
  //  a property named `uri` that contains that route segment when a user hits the page
  const response = await client.query({
    query: GET_POST_BY_URI,
    variables: {
      id: params.uri,
    },
  });
  console.log('★response: ', response);
  const post = response?.data?.post;
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const paths = [];
  return {
    paths,
    fallback: 'blocking',
  };
}
