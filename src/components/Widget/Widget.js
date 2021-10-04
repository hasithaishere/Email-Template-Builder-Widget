import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import EmailEditor from 'react-email-editor';
import UIBlocker from 'react-ui-blocker';
import Request from '../../utils/request';
import '../../../src/components/Widget/Widget.css';
import sampleTemplate from './data/sample-template.json';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const Bar = styled.div`
  flex: 1;
  color: #000;
  padding: 10px;
  display: flex;
  max-height: 60px;
  h1 {
    flex: 1;
    font-size: 16px;
    text-align: left;
  }
  button {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #505659;
    color: #fff;
    border: 0px;
    max-width: 150px;
    cursor: pointer;
  }
`;

const Widget = (props) => {
    const emailEditorRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [blocked, setBlocked] = useState(true);

    const { postUrl, dataUrl=null } = props;
  
    const saveDesign = () => {
      emailEditorRef.current.editor.saveDesign((design) => {
        console.log('saveDesign', design);
        alert('Design JSON has been logged in your developer console.');
      });
    };
  
    const exportHtml = () => {
      emailEditorRef.current.editor.exportHtml((data) => {
        const { design, html } = data;

        setBlocked(true);

        Request.sendPost({
            url: postUrl,
            data: {
                vhtml: design, vcss: '', vbody: html
            }
        }).then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setBlocked(false);
        });

      });
    };
  
    const onDesignLoad = (data) => {
      setBlocked(false);
      setLoaded(true);
      console.log('onDesignLoad', data);
    };

    const loadTemplateToEditor = (template) => {
      emailEditorRef.current.editor.loadDesign(template);
    };

    const loadTemplate = () => {
      if (dataUrl !== null && dataUrl !== '') {
        Request.xhrRequest({ method: 'GET', url: dataUrl }).then(response => {
          loadTemplateToEditor(JSON.parse(response));
        }).catch(error => {
          loadTemplateToEditor({});
          console.log('XHR:Err::', error);
        });
      } else if (localStorage.getItem('etbw-et-json') !== null) {
        try {
          loadTemplateToEditor(JSON.parse(localStorage.getItem('etbw-et-json')));
        } catch (error) {
          loadTemplateToEditor({});
          console.log('Unable to parse template json');
        }
      } else {
        loadTemplateToEditor(sampleTemplate);
      }
    };
  
    const onLoad = () => {
      emailEditorRef.current.editor.addEventListener(
        'onDesignLoad',
        onDesignLoad
      );

      loadTemplate();
      
    };
  
    return (
      <Container>
        <UIBlocker theme="cubeGrid" isVisible={!loaded || blocked} message=''/>
        <Bar>
          <h1></h1>
  
          {/* <button onClick={saveDesign}>Save Design</button> */}
          { loaded && <button onClick={exportHtml}>Save Template</button> }
        </Bar>
  
        <React.StrictMode>
          <EmailEditor ref={emailEditorRef} onLoad={onLoad} />
        </React.StrictMode>
      </Container>    
    );
};

export default Widget;