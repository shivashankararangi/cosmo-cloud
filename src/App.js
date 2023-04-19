import React, { useState } from "react";
import { BiTrash, BiSave, BiPlus} from 'react-icons/bi';

const FieldTypes = {
  String: "string",
  Number: "number",
  Boolean: "boolean",
  Object: "object"
};

const FormField = ({ind, data, setData, onDelete }) => {
  const [name, setName] = useState(data.name);
  const [type, setType] = useState(data.type);
  const [fields, setFields] = useState(data.fields || []);

  const handleNameChange = (e) => {
    setName(e.target.value)
    setData({ name, type, fields });
  };
  const handleTypeChange = (e) => {
    setType(e.target.value)
    setData({ name, type, fields });
  };

  const handleNestedFieldAdd = (index) => {
    setFields([...fields, { name: "", type: FieldTypes.String }]);
    setData({ name, type, fields });
  };

  const handleNestedFieldDelete = (parentIndex, index) => {
    setFields(fields.filter((element,ind)=>index !== ind))
    setData({ name, type, fields });
  };

  const handleSave = () => {
    setData({ name, type, fields });
  };

  return (
    <div>
    <div style={{width:500 ,display:"flex",flexWrap:"wrap"}}>
      <input type="text" value={name} onChange={handleNameChange} />
      <select value={type} onChange={handleTypeChange}>
        {Object.values(FieldTypes).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <div style={{marginTop:6, marginLeft:50,display: "flex",justifyContent: "flex-end"}}>
        <BiTrash style={{marginRight:10}} onClick={()=>{onDelete()}}/>

        {type === FieldTypes.Object && (
          <BiPlus style={{marginRight:10}} onClick={()=>{handleNestedFieldAdd()}}/>
        )}
        <BiSave onClick={handleSave}/>
      </div>
    </div>
    <div style={{marginLeft:40}}>
    {type === FieldTypes.Object && (
      <div style={{flexBasis:100}}>
        {fields.map((field, index) => (
          <FormField
            key={field.name}
            data={field}
            setData={(newData) => {
              const newFields = [...fields];
              newFields[index] = newData;
              setFields(newFields);
            }}
            onDelete={() => handleNestedFieldDelete(ind,index)}
          />
        ))}
      </div>
    )}
    </div>
    </div>
  );
};

const Form = ({ data, setData }) => {
  const [fields, setFields] = useState(data.fields || []);
  function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue((value) => value + 1);
  }
  const forceUpdate = useForceUpdate();

  const handleFieldDelete = (index) => {

    setFields(fields.filter((element,ind)=>index !== ind))
    forceUpdate();
  };

  const handleFieldAdd = () => {
    setFields([...fields, { name: "", type: FieldTypes.String }]);
  };

  const handleSave = () => {
    setData({ fields });
    console.log(fields)
  };

  return (
    <div>
      <button style={{border:0}} onClick={handleFieldAdd}>Add Field</button>
      {fields.map((field, index) => (
        <div>
        <FormField
          key={field.name}
          ind={index}
          data={field}
          setData={(newData) => {
            const newFields = [...fields];
            newFields[index] = newData;
            setFields(newFields);
          }}
          onDelete={() => handleFieldDelete(index)}
        />
        </div>
      ))}
      <button style={{border:0}} onClick={handleSave}>Save</button>
    </div>
  );
};

export default function App() {
  const [formData, setFormData] = useState({
    fields: [
      {
        name: "person",
        type: FieldTypes.Object,
        fields: [
          {
            name: "name",
            type: FieldTypes.Object,
            fields: [
              {
                name: "fname",
                type: FieldTypes.String
              },
              {
                name: "lname",
                type: FieldTypes.String
              }
            ]
          },
          {
            name: "age",
            type: FieldTypes.String
          }
        ]
      },
      {
        name: "order",
        type: FieldTypes.String
      },
      {
        name: "class",
        type: FieldTypes.Number
      },
      {
        name: "Address",
        type: FieldTypes.Object,
        fields: [
          {
            name: "Street",
            type: FieldTypes.String
          },
          {
            name: "City",
            type: FieldTypes.String
          },
          {
            name: "Zip Code",
            type: FieldTypes.String
          }
        ]
      }
    ]
  });
  const [formDataCopy, setFormDataCopy] = useState(JSON.parse(JSON.stringify(formData)));
  return (
    <div>
        <>
          <Form data={formDataCopy} setData={setFormDataCopy} />
        </>
    </div>
  );
}
