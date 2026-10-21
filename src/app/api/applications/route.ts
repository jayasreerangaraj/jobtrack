import { json } from "stream/consumers";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_HASURA_URL;
  const secret = process.env.HASURA_ADMIN_SECRET;
  if (url === undefined) {
    return new Response("Value of NEXT_PUBLIC_HASURA_URL is undefined", {
      status: 500,
    });
  }
  if (secret === undefined) {
    return new Response("value of HASURA_ADMIN_SECRET is undefined", {
      status: 500,
    });
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": secret,
    },
    body: JSON.stringify({
      query: `query GetApplication{
      applications{
      id 
      company 
      role 
      location 
      status 
      applied_date
      }}`,
    }),
  });
  const data = await response.json();
  return Response.json(data);
}

export async function POST(request:Request) {
  const body = await request.json();
const url = process.env.NEXT_PUBLIC_HASURA_URL;
const secret = process.env.HASURA_ADMIN_SECRET;

const response = await fetch(url!, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": secret!,
  },
  body: JSON.stringify({
    query: `
      mutation AddApplication($application: applications_insert_input!) {
        insert_applications_one(object: $application) {
          id
          company
          role
          location
          status
          applied_date
        }
      }
    `,
    variables: {
      application: {
        company: body.company,
        role: body.role,
        location: body.location,
        status: body.status,
        applied_date: new Date().toISOString().split("T")[0], // Set applied_date to the current date
      },
    },
  }),
});

const data = await response.json();
return Response.json(data);
}

 export async function PATCH(request:Request) {
  const body = await request.json();
  const url = process.env.NEXT_PUBLIC_HASURA_URL;
  const secret = process.env.HASURA_ADMIN_SECRET;

  const response = await fetch(url!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": secret!,
    },
    body: JSON.stringify({
      query: `
        mutation UpdateApplication($id: Int!, $application: applications_set_input!) {
          update_applications_by_pk(pk_columns: { id: $id }, _set: $application) {
            id
            company
            role
            location
            status
            applied_date
          }
        }
      `,
      variables: {
        id: body.id,
        application: {
          company: body.company,
          role: body.role,
          location: body.location,
          status: body.status,
        },
      },
    }),
  });

  const data = await response.json();
  return Response.json(data);
}

export async function DELETE(request:Request) {
  const body =await request.json();
  const url = process.env.NEXT_PUBLIC_HASURA_URL;
  const secret = process.env.HASURA_ADMIN_SECRET;

  const response =await fetch(url!,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-hasura-admin-secret": secret!,
    },
    body: JSON.stringify({
      query: `
        mutation DeleteApplication($id: Int!) {
          delete_applications_by_pk(id: $id) {
            id
          }
        }
      `,
      variables: {
        id: body.id,
      },
    }),
  });

  const data = await response.json();
  return Response.json(data);
}
