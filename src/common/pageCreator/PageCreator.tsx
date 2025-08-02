import { useEffect, useState } from "react";
import PageRenderer from "../components/PageRenderer";
import { getConfig } from "../../../src/api/config";
import { PageModel } from "../../models/pageModel";
import { RouteConfigModel } from "../../app/AppRoutes";

function PageCreator(props: RouteConfigModel) {
  const [config, setConfig] = useState<PageModel | null>(null);

  useEffect(() => {
    if (props.configPath) {
      getConfig(props.configPath).then((res: PageModel) => {
        setConfig(res);
      });
    }
  }, [props.configPath]);

  if (!config) {
    return null;
  }

  return <PageRenderer {...config} />;
}

export default PageCreator;
